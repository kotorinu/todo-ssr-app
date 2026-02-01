import { useEffect, useState } from "react";

export async function getServerSideProps() {
  return {
    props: {
      ssrTime: new Date().toLocaleString("ja-JP"),
    },
  };
}

export default function ComparePage(props: { ssrTime: string }) {
  const [csrTime, setCsrTime] = useState("");

  useEffect(() => {
    setCsrTime(new Date().toLocaleString("ja-JP"));
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>SSR / CSR</h1>

      <h2>SSR</h2>
      <p>{props.ssrTime}</p>

      <h2>CSR</h2>
      <p>{csrTime}</p>
    </main>
  );
}
