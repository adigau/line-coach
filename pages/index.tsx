import clsx from "clsx";
import { GetServerSideProps } from "next";
import { ComponentProps, ReactNode } from "react";
import { DASHBOARD_URL } from "../constants";
import { GitHubIcon, SignInIcon } from "../icons";
import { MarketingLayout } from "../layouts/Marketing";
import { signIn } from "next-auth/react";
import * as Server from "../lib/server";
import { Button, LinkButton } from "../primitives/Button";
import { Container } from "../primitives/Container";
import styles from "./index.module.css";

interface FeatureProps extends Omit<ComponentProps<"div">, "title"> {
  description: ReactNode;
  title: ReactNode;
}

function Feature({ title, description, className, ...props }: FeatureProps) {
  return (
    <div className={clsx(className, styles.featuresFeature)} {...props}>
      <h4 className={styles.featuresFeatureTitle}>{title}</h4>
      <p className={styles.featuresFeatureDescription}>{description}</p>
    </div>
  );
}

export default function Index() {
  return (
    <MarketingLayout>
      <Container className={styles.section}>
        <div className={styles.heroInfo}>
          <h1 className={styles.heroTitle}>
            LineCoach: The&nbsp;Actor&apos;s Best&nbsp;Friend
          </h1>
          <p className={styles.heroLead}>
            With its user-friendly interface and powerful features,
            MemorizingBuddy is the perfect tool for actors of all levels to
            perfect their craft and deliver standout performances.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Button icon={<SignInIcon />} onClick={() => signIn()}>
            Sign in
          </Button>
          <LinkButton
            href="https://github.com/adigau/line-coach-by-liveblocks"
            icon={<GitHubIcon />}
            target="_blank"
            variant="secondary"
          >
            Learn more
          </LinkButton>
        </div>
      </Container>
      <Container className={styles.section}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <div className={styles.featuresGrid}>
          <Feature
            description={
              <>
                Highlight the lines you need to memorize in order to focus on
                them more easily.
              </>
            }
            title="Highlight your lines"
          />
          <Feature
            description={
              <>
                Hide your lines from view so that you can test your memorization
                skills without the assistance of the app.
              </>
            }
            title="Hide your lines"
          />
          <Feature
            description={
              <>
                See which other actors are using the app at the same time,
                allowing for collaboration and support.
              </>
            }
            title="See who's online"
          />
          <Feature
            description={
              <>
                Make notes on each line you are learning, as well as see notes
                made by other actors. This can be helpful for understanding
                character motivations or making connections between lines.
              </>
            }
            title="Take notes on each line"
          />
          <Feature
            description={
              <>
                See the count the number of words in each line, allowing you to
                track your progress and ensure you are memorizing your lines
                accurately.
              </>
            }
            title="Know the number of lines and words"
          />
          <Feature
            description={
              <>
                If no one is connected, practice by yourself thasnks to our AI
                who will be very happy to play the other characters for you.
              </>
            }
            title="Practice at anytime"
          />
        </div>
      </Container>
    </MarketingLayout>
  );
}

// If logged in, redirect to dashboard
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await Server.getServerSession(req, res);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: DASHBOARD_URL,
      },
    };
  }

  return {
    props: {},
  };
};
