import path from "path"
import RSS from "rss"
import { defaultOptions, runQuery, writeFile } from "./internals"

const publicPath = "./public"

const buildFeed = () => {}

exports.onPostBuild = async ({ graphql }, pluginOptions) => {
  delete pluginOptions.plugins
  const options = {
    ...defaultOptions,
    ...pluginOptions
  }

  const siteQuery = await runQuery(graphql, options.siteQuery)

  const {
    site: { siteMetadata: { title, description, siteUrl, author } }
  } = siteQuery

  const feedQuery = await runQuery(graphql, options.feedQuery)

  const {
    allMarkdownRemark: { edges: data }
  } = feedQuery;
  const items = data.map((i) => {
    const {
      node: { html, frontmatter, fields }
    } = i;

    let slug = fields.slug || frontmatter.path || frontmatter.slug || frontmatter.url;
    return {
      id: `${siteUrl}${slug}`,
      url: `${siteUrl}${slug}`,
      title: frontmatter.title,
      date_published: new Date(frontmatter.date).toISOString(),
      date_modified: new Date(frontmatter.date).toISOString(),
      content_html: html
    }
  })

  if (options.json) {
    console.log("Generating JSON feed")
    const jsonFeed = {
      version: "https://jsonfeed.org/version/1",
      title: title,
      description: description,
      home_page_url: siteUrl,
      feed_url: `${siteUrl}feed.json`,
      user_comment: `This feed allows you to read the posts from this site in any feed reader that supports the JSON Feed format. To add this feed to your reader, copy the following URL — ${siteUrl}feed.json — and add it your reader.`,
      favicon: `${siteUrl}favicon.ico`,
      author: {
        name: author
      },
      items: items
    }
    await writeFile(
      path.join(publicPath, "feed.json"),
      JSON.stringify(jsonFeed),
      "utf8"
    ).catch(r => {
      console.log("Failed to write JSON Feed file: ", r)
    })
  }

  if (options.rss) {
    console.log("Generating RSS feed")
    const rssFeed = new RSS({
      title: title,
      description: description,
      feed_url: `${siteUrl}feed.rss`,
      site_url: siteUrl,
      image_url: `${siteUrl}favicon.ico`
    });

    items.forEach(i => {
      rssFeed.item({
        title: i.title,
        description: i.content_html,
        url: i.url,
        guid: i.url,
        author: author,
        date: i.date_published
      })
    })

    const rss = rssFeed.xml()
    await writeFile(path.join(publicPath, "feed.xml"), rss, "utf8").catch(r => {
      console.log("Failed to write RSS Feed File:", r)
    })
  }

  return Promise.resolve()
}
