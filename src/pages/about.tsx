import { title } from "@/components/primitives";
import { Navbar } from "@/components/navbar";

export default function DocsPage() {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <h1 className={title()}>About</h1>      
    </div>
  );
}
