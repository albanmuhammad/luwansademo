import Script from "next/script";

export default function SalesforceProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Script
                src="https://cdn.c360a.salesforce.com/beacon/c360a/0d0c0943-d1e4-4472-ae82-4a1b82e85a65/scripts/c360a.min.js"
                strategy="afterInteractive"
            />
            {children}
        </>
    );
}