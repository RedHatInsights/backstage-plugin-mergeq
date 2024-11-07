import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@material-ui/core';
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

export function MergeQComponent() {
  const classes = useStyles();
  const config = useApi(configApiRef);
  const [error, setError] = useState(false);
  const [selfServiceableContent, setSelfServiceableContent] = useState<string | null>(null);
  const [reviewQueueContent, setReviewContent] = useState<string | null>(null);
  const [mergeQueueContent, setMergeContent] = useState<string | null>(null);

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
      const response = await fetch(
        `${backendUrl}/api/proxy/mergeq/app-interface-open-selfserviceable-mr-queue.md`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch the Markdown file');
      }

      const text = await response.text(); 
      setSelfServiceableContent(text);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(true);
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/proxy/mergeq/app-interface-review-queue.md`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch the Markdown file');
      }

      const text = await response.text(); 
      setReviewContent(text);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(true);
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/proxy/mergeq/app-interface-merge-queue.md`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch the Markdown file');
      }

      const text = await response.text(); 
      setMergeContent(text);
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

  const selfserviceableq = (
    <Link target="_blank" to={
        'https://gitlab.cee.redhat.com/service/app-interface-output/-/blob/master/app-interface-open-selfserviceable-mr-queue.md'
      }>
      Self Serviceable Queue
    </Link>
    );
  
  const reviewq = (
    <Link target="_blank" to={
        'https://gitlab.cee.redhat.com/service/app-interface-output/-/blob/master/app-interface-review-queue.md'
      }>
      Review Queue (Non Self-serviceable)
    </Link>
    );
  
  const mergeq = (
    <Link target="_blank" to={
        'https://gitlab.cee.redhat.com/service/app-interface-output/-/blob/master/app-interface-merge-queue.md'
      }>
      Merge Queue
    </Link>
    );
  
  const renderLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} className={classes.customMarkdownLink} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );

  return (
    <Page themeId="tool">
      <Content>
        <Grid container spacing={3} direction="row">
          <Grid item xs={12}>
            <InfoCard title={selfserviceableq}>
              {selfServiceableContent ? (
                <Markdown components={{ a: renderLink }} remarkPlugins={[remarkGfm]}>
                  {selfServiceableContent}
                </Markdown>
              ) : (
                <Typography>Loading...</Typography>
              )}
            </InfoCard>
            <br/>
            <InfoCard title={mergeq}>
              {mergeQueueContent ? (
                <Markdown components={{ a: renderLink }} remarkPlugins={[remarkGfm]}>
                  {mergeQueueContent}
                </Markdown>
              ) : (
                <Typography>Loading...</Typography>
              )}
            </InfoCard>
            <br/>
            <InfoCard title={reviewq}>
              {reviewQueueContent ? (
                <Markdown components={{ a: renderLink }} remarkPlugins={[remarkGfm]}>
                  {reviewQueueContent}
                </Markdown>
              ) : (
                <Typography>Loading...</Typography>
              )}
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
}
