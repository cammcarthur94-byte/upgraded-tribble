import asyncio
import urllib.parse
import json
import datetime
import os
from playwright.async_api import async_playwright
from playwright_stealth import Stealth

async def scrape_target_layout(page, query: str, mode: str) -> dict:
    """
    Executes a single search browser action against Google.
    
    Modes:
    - "ai_mode": Targets the pure generative interface via &udm=50
    - "overview": Targets the SGE experimental summary card atop standard searches
    """
    # Programmatically encode the raw text prompt to bind safely into the search URL path
    safe_query = urllib.parse.quote_plus(query)
    
    if mode == "ai_mode":
        url = f"https://www.google.com/search?q={safe_query}&udm=50&hl=en"
    else:
        url = f"https://www.google.com/search?q={safe_query}&hl=en"
        
    # Standardised JSON data schema response contract
    response_payload = {
        "query": query,
        "mode": mode,
        "status": "failed",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "data": {
            "raw_ai_text": "",
            "citations": []
        },
        "error": None
    }
    
    try:
        # Navigate browser context to the linked search target
        await page.goto(url, wait_until="domcontentloaded")
        
        # Check and handle cookie consent buttons if present
        try:
            consent_btn = page.locator("button:has-text('Accept all'), button:has-text('I agree'), button:has-text('Reject all')")
            if await consent_btn.count() > 0:
                await consent_btn.first.click(timeout=2000)
                await page.wait_for_timeout(1000)
        except Exception:
            pass

        # If a CAPTCHA / bot challenge appears, allow user time to solve it in the headed window
        if "sorry" in page.url or "recaptcha" in (await page.content()).lower():
            print("    [!] CAPTCHA challenge detected on screen! Please solve it in the browser window...")
            try:
                await page.wait_for_function("() => !window.location.href.includes('sorry')", timeout=90000)
                print("    [✓] CAPTCHA resolved! Continuing extraction...")
                await page.wait_for_timeout(2000)
            except Exception:
                print("    [!] CAPTCHA wait period timed out.")

        if mode == "ai_mode":
            # --- GOOGLE AI MODE LAYOUT EXTRACTOR ---
            # Wait for Google's async streaming container to initialize in the DOM
            container_selector = "div[data-async-context]"
            try:
                await page.wait_for_selector(container_selector, timeout=10000)
            except Exception:
                # Fallback selectors if data-async-context isn't present
                container_selector = "#search, #rso, div#main"
                await page.wait_for_selector(container_selector, timeout=8000)
            
            # Smooth scroll to ensure late network payloads render completely
            await page.mouse.wheel(0, 200)
            await page.wait_for_timeout(2500)
            
            # Extract raw block text
            raw_text = await page.locator(container_selector).first.inner_text()
            response_payload["data"]["raw_ai_text"] = raw_text.strip()
            
            # Parse nested anchor references, filtering out standard tracking links
            links = page.locator(f"{container_selector} a[href]")
            for i in range(await links.count()):
                href = await links.nth(i).get_attribute("href")
                if href and "google.com" not in href and href.startswith("http"):
                    if href not in response_payload["data"]["citations"]:
                        response_payload["data"]["citations"].append(href)
                        
        else:
            # --- GOOGLE AI OVERVIEW (SGE) LAYOUT EXTRACTOR ---
            # Google frames general AI previews inside experimental modular cards
            overview_selector = "div[data-md], div[jsname], div#rso"
            
            # Induce interactive browser scrolling to wake lazy-loaded scripts
            await page.mouse.wheel(0, 400)
            try:
                await page.wait_for_selector("div[data-md]", timeout=6000)
                overview_selector = "div[data-md]"
            except Exception:
                overview_selector = "div#rso, #search"
                await page.wait_for_selector(overview_selector, timeout=6000)
                
            await page.wait_for_timeout(2500)
            
            # Grab content directly from the generated contextual overview box
            raw_text = await page.locator(overview_selector).first.inner_text()
            response_payload["data"]["raw_ai_text"] = raw_text.strip()
            
            # Isolate nested links found strictly inside the overview component block
            links = page.locator(f"{overview_selector} a[href]")
            for i in range(await links.count()):
                href = await links.nth(i).get_attribute("href")
                if href and "google.com" not in href and href.startswith("http"):
                    if href not in response_payload["data"]["citations"]:
                        response_payload["data"]["citations"].append(href)
                        
        response_payload["status"] = "success"
        
    except Exception as e:
        # Trigger diagnostic security camera screenshot if blocking page or layout drift happens
        timestamp_slug = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
        screenshot_filename = f"error_{mode}_{timestamp_slug}.png"
        try:
            await page.screenshot(path=screenshot_filename, full_page=True)
            response_payload["error"] = f"Extraction failed. Reference snapshot saved to {screenshot_filename}. Details: {str(e)}"
        except Exception as screenshot_err:
            response_payload["error"] = f"Extraction failed: {str(e)}. Screenshot failed: {str(screenshot_err)}"
        
    return response_payload

async def execute_orchestration_pipeline(prompts: list, proxy: str = None):
    """Orchestrates loop processing of a custom prompt bank across both system interfaces."""
    master_output_manifest = []
    stealth = Stealth()
    
    async with async_playwright() as p:
        browser_configuration = {"headless": False}
        if proxy:
            browser_configuration["proxy"] = {"server": proxy}
            
        # Spin up visible automated Chromium process runtime instance
        browser = await p.chromium.launch(**browser_configuration)
        
        # Structure browser fingerprints to mirror an actual clean human desktop terminal user profile
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="en-US"
        )
        
        page = await context.new_page()
        await stealth.apply_stealth_async(page) # Scrub framework signatures that trigger server-side robot alarms
        
        total_prompts = len(prompts)
        for index, text_prompt in enumerate(prompts, 1):
            print(f"[{index}/{total_prompts}] Distributing prompt to layouts: '{text_prompt}'")
            
            # Operational Pipeline Phase 1: Dedicated AI Mode Extraction
            print(f" -> Fetching AI Mode response via forced parameter...")
            ai_mode_result = await scrape_target_layout(page, text_prompt, mode="ai_mode")
            print(f"    Status: {ai_mode_result['status']} | Citations: {len(ai_mode_result['data']['citations'])}")
            master_output_manifest.append(ai_mode_result)
            
            # Brief strategic cooldown to simulate organic human navigation reading pacing
            await asyncio.sleep(3.5)
            
            # Operational Pipeline Phase 2: Standard Search AI Overview Extraction
            print(f" -> Fetching standard AI Overview response layout...")
            overview_result = await scrape_target_layout(page, text_prompt, mode="overview")
            print(f"    Status: {overview_result['status']} | Citations: {len(overview_result['data']['citations'])}")
            master_output_manifest.append(overview_result)
            
            # Extended cooldown gap to lower cumulative browser fingerprint signatures
            await asyncio.sleep(4.5)
            
        await browser.close()
        
    # Write the completed scraping dataset results back to disk in JSON format
    target_output_file = "google_ai_scraped_manifest.json"
    with open(target_output_file, "w", encoding="utf-8") as file_stream:
        json.dump(master_output_manifest, file_stream, indent=2, ensure_ascii=False)
        
    print(f"\nPipeline processing completed. Structured dataset written successfully to: '{os.path.abspath(target_output_file)}'")

if __name__ == "__main__":
    # Add or update text queries inside this list array wrapper to pipeline them dynamically
    prompt_bank_to_process = [
        "What are the environmental impacts of vertical farming vs traditional farming",
        "Explain the core components needed to construct an electric car battery pack"
    ]
    
    # Initialize system worker
    asyncio.run(execute_orchestration_pipeline(prompt_bank_to_process))
