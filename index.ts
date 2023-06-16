// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes, root, state } from "membrane";

export async function getSchema({ args: { name } }) {
  const item = await nodes.directory
    .file({ path: name })
    .$query(`{ name sha html_url size download_url }`);
    
  const res = await repoFromUrl(item.html_url as any).$query(
    `{
         name
         content {
           file(path: "memconfig.json") {
             content
           }
       }
     }`
  );
  return res.content?.file?.content!;
}

function repoFromUrl(url: string): github.Repository {
  const [, user, repo] = url.match("https://github.com/([^/]+)/([^/]+)")!;
  return nodes.github.users.one({ name: user }).repos.one({ name: repo });
}
