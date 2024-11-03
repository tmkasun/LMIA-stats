import { AppType } from "next/app";
import "../css/globals.css";

import Layout from "../layouts/root";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

const CanPR: AppType = ({ Component, pageProps: { ...pageProps } }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                <Head>
                    <link rel="shortcut icon" href="https://open.canada.ca/GCWeb/assets/favicon.ico" />
                </Head>
                <Component {...pageProps} />
            </Layout>
        </QueryClientProvider>
    );
};

export default CanPR;
