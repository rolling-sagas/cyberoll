export const runtime = 'experimental-edge';

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  // Pass data to the page via props
  return { props: { repo } }
}

export default function Page({repo}) {
  console.log(1122, repo)
  return (
    <div>123</div>
  )
}
