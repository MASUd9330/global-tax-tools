import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmbedWidget } from "@/components/EmbedWidget";

export const metadata = {
  title: "Embed TaxRank on Your Site",
  description:
    "Free embeddable tax calculator widget. Drop a single line of HTML into any blog, job board, or expat portal and serve live tax estimates.",
};

// Keep docs page indexable but lightweight
export const dynamic = "force-dynamic";

export default function EmbedDocsPage() {
  const origin = "https://global-tax-tools.vercel.app";

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Embed TaxRank on Your Site</h1>
        <p className="mt-2 text-slate-600">
          Free, self-contained tax calculator widget. Drop one line of HTML into your blog, job board,
          or expat portal — your visitors get live tax estimates without leaving your page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live preview (US, $75k)</CardTitle>
        </CardHeader>
        <CardContent>
          <EmbedWidget country="US" income={75000} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1. iframe (simplest)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">
            Paste this HTML anywhere on your page. Resize the height to match your layout.
          </p>
          <pre className="bg-slate-900 text-slate-100 rounded p-3 text-xs overflow-x-auto">
{`<iframe
  src="${origin}/embed/US"
  width="100%"
  height="500"
  frameborder="0"
  style="border:0;border-radius:8px"
  loading="lazy"
  title="Tax calculator">
</iframe>`}
          </pre>
          <p className="text-xs text-slate-500">
            Supported country codes: US, GB, DE, FR, CA, IT, JP, AU, ES, NL, IE, CH, SG, AE, PT, IN, BR, MX, NZ, SE, NO, DK.
            For US states, append <code className="bg-slate-100 px-1 rounded">?state=california</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. JS snippet (auto-resize, recommended)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">
            Loads the widget in an iframe and auto-syncs height to fit content.
          </p>
          <pre className="bg-slate-900 text-slate-100 rounded p-3 text-xs overflow-x-auto">
{`<div id="taxrank-embed" data-country="US" data-income="100000" style="max-width:480px"></div>
<script>
(function(){
  var el = document.getElementById('taxrank-embed');
  if (!el) return;
  var country = el.dataset.country || 'US';
  var income = el.dataset.income || '75000';
  var state = el.dataset.state || '';
  var theme = el.dataset.theme || 'light';
  var qs = '?income=' + income + (state ? '&state=' + state : '') + (theme === 'dark' ? '&theme=dark' : '');
  var iframe = document.createElement('iframe');
  iframe.src = '${origin}/embed/' + country + qs;
  iframe.style.cssText = 'width:100%;border:0;border-radius:8px;background:transparent';
  iframe.setAttribute('scrolling', 'no');
  iframe.title = 'Tax calculator';
  el.appendChild(iframe);
  window.addEventListener('message', function(e){
    try {
      var d = e.data || {};
      if (d && d.type === 'taxrank-embed-height') {
        iframe.style.height = (d.height + 16) + 'px';
      }
    } catch(_) {}
  });
})();
</script>`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Query string parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2">Param</th>
                <th className="py-2">Default</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 font-mono text-xs">country</td>
                <td className="py-2">US</td>
                <td className="py-2 text-slate-600">2-letter ISO code (path segment)</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 font-mono text-xs">state</td>
                <td className="py-2">—</td>
                <td className="py-2 text-slate-600">US state slug (e.g. <code>california</code>, <code>texas</code>)</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 font-mono text-xs">income</td>
                <td className="py-2">75000</td>
                <td className="py-2 text-slate-600">Annual gross income in user's currency</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-xs">theme</td>
                <td className="py-2">light</td>
                <td className="py-2 text-slate-600"><code>light</code> or <code>dark</code></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Use cases</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
            <li>Expat blogs comparing cost-of-living between countries</li>
            <li>Job boards showing "estimated take-home" on salary listings</li>
            <li>Personal finance / FIRE calculators that need a tax layer</li>
            <li>Remote work guides evaluating country options</li>
            <li>Recruiting sites helping candidates negotiate offers</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700 space-y-2">
          <p>Free for any site, no signup required. Attribution appreciated but not required.</p>
          <p>
            Brackets are 2025 values and may differ from your local jurisdiction — see{" "}
            <a href="/methodology/" className="underline hover:text-slate-900">methodology</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}