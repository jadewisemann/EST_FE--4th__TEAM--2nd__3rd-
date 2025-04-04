const MetaData = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
}) => {
  const finalTitle = title || '푹자요 | 최고의 숙박 예약 서비스';
  const finalDescription =
    description
    || '푹자요에서 최고의 숙박 경험을 시작하세요. 전국 호텔, 리조트, 펜션을 한 곳에서!';
  const finalKeywords = keywords || '숙박, 호텔, 예약, 펜션, 리조트, 여행';
  const finalOgTitle = ogTitle || title || '푹자요 | 최고의 숙박 예약 서비스';
  const finalOgDescription =
    ogDescription
    || description
    || '푹자요에서 최고의 숙박 경험을 시작하세요. 전국 호텔, 리조트, 펜션을 한 곳에서!';
  const finalOgImage = ogImage || '/src/assets/img/bg_logo.svg';

  return (
    <>
      <title>{finalTitle}</title>
      <meta name='description' content={finalDescription} />
      <meta name='keywords' content={finalKeywords} />

      <meta property='og:title' content={finalOgTitle} />
      <meta property='og:description' content={finalOgDescription} />
      <meta property='og:image' content={finalOgImage} />
      <meta property='og:url' content={window.location.href} />
      <meta property='og:type' content='website' />
    </>
  );
};

export default MetaData;
