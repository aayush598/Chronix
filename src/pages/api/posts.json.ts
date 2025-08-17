export async function GET() {
  // Get all blog posts
  const posts = await import.meta.glob('../../content/blog/*.md');
  
  const postData = await Promise.all(
    Object.entries(posts).map(async ([path, post]) => {
      const { frontmatter } = await post() as any;
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      
      return {
        frontmatter,
        url: `/blog/${slug}`,
        slug
      };
    })
  );
  
  // Sort by publication date (newest first)
  const sortedPosts = postData.sort((a, b) => 
    new Date(b.frontmatter.pubDate).valueOf() - new Date(a.frontmatter.pubDate).valueOf()
  );
  
  return new Response(JSON.stringify(sortedPosts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}