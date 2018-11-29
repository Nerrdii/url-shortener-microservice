# URL Shortener Microservice

## Overview

Creates shortened URLs

## User Stories

1. I can POST a URL to `/api/shorturl/new` and I will receive a shortened URL in the JSON response. Example: `{ "original_url": "www.google.com", "short_url": 1 }`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{ "error": "invalid URL" }`.
3. When I visit the shortened URL, it will redirect me to my original link.

## Example Usage

POST `/api/shorturl/new`

body:

```json
{ "url": "https://www.google.com" }
```

will lead to a shortened URL.

GET `/api/shorturl/5bff426af8853c1384f86d82`

will redirect to [Google](https://www.google.com)
