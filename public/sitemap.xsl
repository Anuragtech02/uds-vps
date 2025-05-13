<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="sitemap xhtml">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html>
            <head>
                <title>XML Sitemap</title>
                <style type="text/css">
                    body { font-family: Helvetica, Arial, sans-serif; font-size: 13px; color: #545454; }
                    table { border: none; border-collapse: collapse; width: 100%; }
                    th { border-bottom: 1px solid #ccc; text-align: left; padding:5px; font-size: 1.1em;}
                    td { border-bottom: 1px solid #eee; padding: 5px; }
                    td a { color: #000; text-decoration: none; }
                    td a:hover { text-decoration: underline; }
                    .alternates { font-size: 0.9em; color: #777; padding-left: 20px;}
                    .alternates a { color: #555; }
                </style>
            </head>
            <body>
                <h1>XML Sitemap</h1>
                <xsl:choose>
                    <xsl:when test="/sitemap:sitemapindex">
                        <p>This XML Sitemap Index file contains <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.</p>
                        <table cellpadding="3">
                            <thead>
                                <tr>
                                    <th>Sitemap Location</th>
                                    <th>Last Modified</th>
                                </tr>
                            </thead>
                            <tbody>
                                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                                    <tr>
                                        <td>
                                            <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                                        </td>
                                        <td>
                                            <xsl:value-of select="sitemap:lastmod"/>
                                        </td>
                                    </tr>
                                </xsl:for-each>
                            </tbody>
                        </table>
                    </xsl:when>
                    <xsl:when test="/sitemap:urlset">
                        <p>This XML Sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.</p>
                        <table cellpadding="3">
                            <thead>
                                <tr>
                                    <th>URL Location</th>
                                    <th>Last Modified</th>
                                    <th>Change Frequency</th>
                                    <th>Priority</th>
                                    <th>Alternate Languages</th>
                                </tr>
                            </thead>
                            <tbody>
                                <xsl:for-each select="sitemap:urlset/sitemap:url">
                                    <tr>
                                        <td>
                                            <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                                        </td>
                                        <td>
                                            <xsl:value-of select="sitemap:lastmod"/>
                                        </td>
                                        <td>
                                            <xsl:value-of select="sitemap:changefreq"/>
                                        </td>
                                        <td>
                                            <xsl:value-of select="sitemap:priority"/>
                                        </td>
                                        <td>
                                            <xsl:if test="xhtml:link">
                                                <div class="alternates">
                                                    <xsl:for-each select="xhtml:link">
                                                        <a href="{@href}" hreflang="{@hreflang}" rel="alternate">
                                                            <xsl:value-of select="@hreflang"/>
                                                        </a>
                                                        <xsl:if test="position() != last()"> | </xsl:if>
                                                    </xsl:for-each>
                                                </div>
                                            </xsl:if>
                                        </td>
                                    </tr>
                                </xsl:for-each>
                            </tbody>
                        </table>
                    </xsl:when>
                    <xsl:otherwise>
                        <p>Unknown sitemap format.</p>
                    </xsl:otherwise>
                </xsl:choose>
                <p>Generated by Custom Script</p>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>