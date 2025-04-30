import NavBar from "@/components/navbar/navbar";
export default async function Layout({ children }) {

  return (
    <div>
      <NavBar />
    {children}</div>
  );
}
