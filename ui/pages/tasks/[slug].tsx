import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

const CreateBounty: NextPage = () => {
  const router = useRouter();
  return (
    <div>
      <h1>Create Bounty{router.query.slug}</h1>
    </div>
  );
};

export default CreateBounty;
