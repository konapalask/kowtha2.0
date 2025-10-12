import Error from "next/error";

const CustomErrorComponent = (props: any) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: any) => {
  // Try to use Sentry if available, otherwise just return error props
  try {
    const Sentry = await import("@sentry/nextjs");
    // In case this is running in a serverless function, await this in order to give Sentry
    // time to send the error before the lambda exits
    await Sentry.captureUnderscoreErrorException(contextData);
  } catch (e) {
    // Sentry not available - skip error tracking
    console.log("Error tracking not available");
  }

  // This will contain the status code of the response
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
