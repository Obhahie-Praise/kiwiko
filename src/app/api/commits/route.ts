// app/api/commits/route.ts

export async function GET() {
  const response = await fetch(
    "https://api.github.com/repos/Obhahie-Praise/kiwiko/commits",
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 60 } // cache for 60 seconds
    }
  );

  const data = await response.json();

  const commits = data.map((commit: any) => ({
    message: commit.commit.message,
    author: commit.commit.author.name,
    date: commit.commit.author.date,
  }));

  return Response.json(commits);
}