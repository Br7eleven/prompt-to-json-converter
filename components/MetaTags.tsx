import React from "react";
import { Helmet } from "react-helmet";

interface MetaTagsProps {
  title: string;
  description: string;
  url: string;
  image: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, url, image }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index, follow" />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </Helmet>
);

export default MetaTags;
