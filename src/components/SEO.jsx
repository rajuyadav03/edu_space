import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, type = 'website', name = 'EduSpace' }) {
    // Ensure we append the brand name dynamically if it's not already there
    const formattedTitle = title ? `${title} | EduSpace` : 'EduSpace - Rent School & College Spaces';

    const siteDescription = description || 'Rent school and college spaces for tuition, training, and events during holidays and weekends.';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{formattedTitle}</title>
            <meta name='description' content={siteDescription} />

            {/* Open Graph tags for social sharing (Facebook, LinkedIn, etc.) */}
            <meta property='og:type' content={type} />
            <meta property='og:title' content={formattedTitle} />
            <meta property='og:description' content={siteDescription} />
            <meta property='og:site_name' content={name} />

            {/* Twitter tags */}
            <meta name='twitter:creator' content={name} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={formattedTitle} />
            <meta name='twitter:description' content={siteDescription} />
        </Helmet>
    );
}
