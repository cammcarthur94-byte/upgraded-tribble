import os
import sys
import json
import datetime
from pathlib import Path
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from google import genai
from google.genai import types

# Load environment variables from .env.local or .env
env_paths = [Path(".env.local"), Path(".env")]
for p in env_paths:
    if p.exists():
        load_dotenv(dotenv_path=p, override=False)

def get_client() -> genai.Client:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("\n" + "=" * 60)
        print("[!] GEMINI_API_KEY is not set.")
        print("    Please set it in your .env.local file or as an environment variable:")
        print("    GEMINI_API_KEY=\"AIzaSy...\"")
        print("    Get a free key from: https://aistudio.google.com/")
        print("=" * 60 + "\n")
        # Prompt user to enter key if running interactively
        try:
            user_key = input("Enter your Gemini API Key (or press Enter to exit): ").strip()
            if user_key:
                os.environ["GEMINI_API_KEY"] = user_key
                api_key = user_key
            else:
                sys.exit(1)
        except (KeyboardInterrupt, EOFError):
            sys.exit(1)
            
    return genai.Client(api_key=api_key)

# =====================================================================
# FEATURE 1: GOOGLE AI OVERVIEWS (SEARCH-GROUNDED SUMMARIES & CITATIONS)
# =====================================================================

def generate_google_ai_overview(prompt: str, client: genai.Client = None, model: str = "gemini-3.5-flash-lite") -> dict:
    """
    Executes a real-time Google Search Grounded query via Gemini API.
    Replicates the Google AI Overview experience without CAPTCHAs or headless browser fragility.
    """
    if client is None:
        client = get_client()

    response_payload = {
        "query": prompt,
        "mode": "ai_overview_grounded",
        "status": "failed",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "data": {
            "raw_ai_text": "",
            "citations": [],
            "search_queries": []
        },
        "error": None
    }

    try:
        # Request content with real-time Google Search grounding enabled
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())],
                temperature=0.2,
            )
        )

        response_payload["data"]["raw_ai_text"] = response.text or ""

        # Extract web citations and search queries from grounding metadata
        if response.candidates and response.candidates[0].grounding_metadata:
            meta = response.candidates[0].grounding_metadata
            
            # Extract search queries used by the model
            if meta.web_search_queries:
                response_payload["data"]["search_queries"] = list(meta.web_search_queries)
                
            # Extract citations / URLs
            if meta.grounding_chunks:
                for chunk in meta.grounding_chunks:
                    if chunk.web and chunk.web.uri:
                        citation = {
                            "title": chunk.web.title or "Web Result",
                            "url": chunk.web.uri
                        }
                        if citation not in response_payload["data"]["citations"]:
                            response_payload["data"]["citations"].append(citation)

        response_payload["status"] = "success"

    except Exception as e:
        err_str = str(e)
        if "RESOURCE_EXHAUSTED" in err_str:
            response_payload["error"] = (
                "Search Grounding quota exceeded. Google Search Grounding requires a project with "
                "billing / Pay-As-You-Go enabled in Google AI Studio (https://aistudio.google.com/)."
            )
        else:
            response_payload["error"] = err_str

    return response_payload

def generate_pure_gemini_response(prompt: str, client: genai.Client = None, model: str = "gemini-3.5-flash-lite") -> dict:
    """
    Executes standard Gemini LLM generation without search grounding (pure conversational intelligence).
    """
    if client is None:
        client = get_client()

    response_payload = {
        "query": prompt,
        "mode": "gemini_llm",
        "status": "failed",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "data": {
            "raw_ai_text": ""
        },
        "error": None
    }

    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
            )
        )
        response_payload["data"]["raw_ai_text"] = response.text or ""
        response_payload["status"] = "success"

    except Exception as e:
        response_payload["error"] = str(e)

    return response_payload

def run_ai_overviews_batch(prompts: list[str], output_file: str = "google_ai_scraped_manifest.json", model: str = "gemini-3.5-flash-lite"):
    """Runs a batch bank of search queries through Google AI Overviews and saves structured JSON."""
    client = get_client()
    master_manifest = []
    total = len(prompts)

    print(f"\n🚀 Starting Google AI Overview batch processing ({total} prompts)...")
    for idx, prompt in enumerate(prompts, 1):
        print(f"\n[{idx}/{total}] Processing: '{prompt}'")
        result = generate_google_ai_overview(prompt, client=client, model=model)
        
        if result["status"] == "success":
            cit_count = len(result["data"]["citations"])
            print(f" -> ✓ Success ({cit_count} source citations captured)")
        else:
            print(f" -> ✗ Failed: {result['error']}")
            
        master_manifest.append(result)

    # Save to disk
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(master_manifest, f, indent=2, ensure_ascii=False)

    print(f"\n✨ Manifest successfully written to: '{os.path.abspath(output_file)}'")

def run_dual_pipeline_batch(prompts: list[str], output_file: str = "gemini_dual_comparison_manifest.json", model: str = "gemini-3.5-flash-lite"):
    """
    Executes each prompt across BOTH engines side-by-side:
    1. Standard Gemini Chatbot / LLM (Knowledge & reasoning)
    2. Google AI Overview (Live Google Search Grounding & citations)
    """
    client = get_client()
    master_manifest = []
    total = len(prompts)

    print(f"\n⚡ Starting Dual Pipeline Processing ({total} prompts)...")
    for idx, prompt in enumerate(prompts, 1):
        print(f"\n[{idx}/{total}] Prompt: '{prompt}'")
        
        # Engine 1: Pure Gemini LLM
        print(" -> [1/2] Querying Standard Gemini LLM...")
        gemini_res = generate_pure_gemini_response(prompt, client=client, model=model)
        if gemini_res["status"] == "success":
            print("    ✓ Gemini response generated")
        else:
            print(f"    ✗ Gemini failed: {gemini_res['error']}")
            
        # Engine 2: Google AI Overview
        print(" -> [2/2] Querying Google AI Overview (Search Grounded)...")
        overview_res = generate_google_ai_overview(prompt, client=client, model=model)
        if overview_res["status"] == "success":
            cit_count = len(overview_res["data"]["citations"])
            print(f"    ✓ AI Overview generated ({cit_count} citations captured)")
        else:
            print(f"    ✗ AI Overview failed: {overview_res['error']}")

        # Combine both outputs side by side
        dual_record = {
            "query": prompt,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "gemini_chat": gemini_res,
            "google_ai_overview": overview_res
        }
        master_manifest.append(dual_record)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(master_manifest, f, indent=2, ensure_ascii=False)

    print(f"\n✨ Dual comparison manifest written to: '{os.path.abspath(output_file)}'")

# =====================================================================
# FEATURE 2: INTERACTIVE GEMINI CHATBOT (MULTI-TURN CONVERSATION)
# =====================================================================

def start_interactive_chatbot(model: str = "gemini-3.5-flash-lite", enable_grounding: bool = False):
    """
    Launches an interactive multi-turn Gemini Chatbot with optional live Google Search Grounding.
    """
    client = get_client()
    
    print("\n" + "=" * 65)
    print("🤖 GEMINI INTERACTIVE CHATBOT")
    print(f"   Model: {model}")
    print(f"   Live Google Search Grounding: {'[ON]' if enable_grounding else '[OFF]'}")
    print("   Commands: /search (toggle search), /clear (reset chat), /quit (exit)")
    print("=" * 65 + "\n")

    # Build initial chat session
    config = types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())] if enable_grounding else None,
        temperature=0.7
    )
    chat = client.chats.create(model=model, config=config)

    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue

            # Command Handling
            if user_input.lower() in ["exit", "quit", "/quit", "/exit"]:
                print("\n👋 Goodbye!")
                break
            elif user_input.lower() == "/clear":
                chat = client.chats.create(model=model, config=config)
                print("\n🧹 Chat history cleared. Started new session.")
                continue
            elif user_input.lower() == "/search":
                enable_grounding = not enable_grounding
                config = types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())] if enable_grounding else None,
                    temperature=0.7
                )
                chat = client.chats.create(model=model, config=config)
                status = "ENABLED (Live Web Search)" if enable_grounding else "DISABLED (Pure LLM)"
                print(f"\n🔄 Google Search Grounding is now: {status}")
                continue

            print("\nGemini: Thinking...", end="\r")
            response = chat.send_message(user_input)
            
            # Print response text
            print(f"\nGemini:\n{response.text}\n")

            # If search grounding was used, display the citations
            if enable_grounding and response.candidates and response.candidates[0].grounding_metadata:
                meta = response.candidates[0].grounding_metadata
                if meta.grounding_chunks:
                    print("📌 Sources & Citations:")
                    for chunk in meta.grounding_chunks:
                        if chunk.web and chunk.web.uri:
                            title = chunk.web.title or "Source"
                            print(f"  • {title}: {chunk.web.uri}")

        except KeyboardInterrupt:
            print("\n\nSession terminated by user.")
            break
        except Exception as e:
            print(f"\n[!] Error: {str(e)}")

# =====================================================================
# CLI RUNNER & DISPATCHER
# =====================================================================

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Gemini API Suite: AI Overviews & Chatbot")
    parser.add_argument("--mode", choices=["overview", "chat", "dual", "menu"], default="menu",
                        help="Choose 'overview' for Google AI Overviews batch, 'chat' for interactive chatbot, 'dual' for side-by-side comparison, or 'menu'.")
    parser.add_argument("--query", type=str, help="Single query to run for AI Overview")
    parser.add_argument("--model", type=str, default="gemini-3.5-flash-lite", help="Gemini model name")
    parser.add_argument("--grounding", action="store_true", help="Enable search grounding for chat")

    args = parser.parse_args()

    default_prompts = [
        "What are the environmental impacts of vertical farming vs traditional farming",
        "Explain the core components needed to construct an electric car battery pack"
    ]

    if args.mode == "overview":
        if args.query:
            result = generate_google_ai_overview(args.query, model=args.model)
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            run_ai_overviews_batch(default_prompts, model=args.model)

    elif args.mode == "dual":
        run_dual_pipeline_batch(default_prompts, model=args.model)

    elif args.mode == "chat":
        start_interactive_chatbot(model=args.model, enable_grounding=args.grounding)

    else:
        # Interactive Menu
        print("\n==========================================")
        print("  GEMINI MULTI-FEATURE PIPELINE")
        print("==========================================")
        print("1. Run Google AI Overviews Engine (Batch search grounding & export citations)")
        print("2. Run Dual Engine Comparison (Pure Gemini vs. Search-Grounded AI Overview)")
        print("3. Launch Interactive Gemini Chatbot (Multi-turn conversation)")
        print("4. Exit")
        choice = input("\nSelect an option [1-4]: ").strip()

        if choice == "1":
            run_ai_overviews_batch(default_prompts, model=args.model)
        elif choice == "2":
            run_dual_pipeline_batch(default_prompts, model=args.model)
        elif choice == "3":
            start_interactive_chatbot(model=args.model, enable_grounding=False)
        else:
            print("Exiting.")
