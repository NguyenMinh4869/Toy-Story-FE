process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
async function run() {
  const r2 = await fetch('https://localhost:7217/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const d2 = await r2.json().catch(() => null) || await r2.text();
  console.log("===POST ARTICLE===\n", d2);
  
  const r3 = await fetch('https://localhost:7217/api/article-categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const d3 = await r3.json().catch(() => null) || await r3.text();
  console.log("===POST CATEGORY===\n", d3);
}
run();
