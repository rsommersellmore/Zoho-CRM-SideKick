// Resolves the module name a Zoho CRM URL shows (e.g. /tab/Potentials/...) to the module of the API.
// Pure functions, used by the tools.

import type { ZohoModule } from "./types";

// Legacy tab names the web app still uses in its URLs, mapped to today's API names. Renamed modules
// otherwise keep their tab name as "module_name" in the modules metadata.
const LEGACY_TAB_NAMES: Record<string, string> = {
    potentials: "Deals"
};

// "Price_Books", "PriceBooks" and "pricebooks" all name the same module
function normalize(name: string | undefined | null): string {
    return (name ?? "").replace(/[\s_]/g, "").toLowerCase();
}

export function findModuleForTab(modules: ZohoModule[] | null | undefined, tab: string): ZohoModule | null {
    if (!modules?.length || !tab) return null;

    const exact = modules.find((m) => m.module_name === tab) ?? modules.find((m) => m.api_name === tab);
    if (exact) return exact;

    const wanted = normalize(tab);
    const normalized =
        modules.find((m) => normalize(m.module_name) === wanted) ??
        modules.find((m) => normalize(m.api_name) === wanted);
    if (normalized) return normalized;

    const legacyApiName = LEGACY_TAB_NAMES[wanted];
    if (legacyApiName) return modules.find((m) => m.api_name === legacyApiName) ?? null;

    return null;
}
