import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { InfoCard, Page, Content, Link } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { makeStyles } from '@material-ui/core/styles';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const useStyles = makeStyles({
  customMarkdownLink: {
    color: 'lightblue',
    textDecoration: 'none',
    '&:hover': {
      color: 'blue',
    },
  },
});

export function QueueTable({
  markdown,
  title,
}: {
  markdown: string;
  title: string;
}) {
  const classes = useStyles();
  const config = useApi(configApiRef);
  const [error, setError] = useState(false);
  const [queueData, setQueueData] = useState<string | null>(null);

  const backendUrl = config.getString('backend.baseUrl');

  useEffect(() => {
    fetchMergeQ();

    const intervalId = setInterval(() => {
      fetchMergeQ();
    }, 120000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchMergeQ = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/proxy/mergeq/${markdown}`);
      if (!response.ok) {
        throw new Error('Failed to fetch the Markdown file');
      }

      const text = await response.text();
      setQueueData(text);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(true);
    }
  };

  if (error) {
    return (
      <Page themeId="tool">
        <Content>
          <Typography variant="body1" color="error">
            Failed to load the Merge Queue data. Please try again later.
          </Typography>
        </Content>
      </Page>
    );
  }

  const titleLink = (
    <Link target="_blank" to={`https://gitlab.cee.redhat.com/service/app-interface-output/-/blob/master/${markdown}`}>
      {title}
    </Link>
  );

  const renderLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      className={classes.customMarkdownLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );

  return (
    <InfoCard title={titleLink}>
      {queueData ? (
        <Markdown
          components={{
            a: renderLink,
            table: Table,
            tr: TableRow,
            td: TableCell,
            th: TableCell,
          }}
          remarkPlugins={[remarkGfm]}
        >
          {queueData}
        </Markdown>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </InfoCard>
  );
}
