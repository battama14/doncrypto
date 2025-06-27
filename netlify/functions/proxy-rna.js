exports.handler = async function(event) {
  const query = event.queryStringParameters?.query;
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing query parameter' }),
    };
  }
  try {
    // Proxy public cors-anywhere pour contourner problème CORS / accès API
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = `https://entreprise.data.gouv.fr/api/rna/v1/full_text/${encodeURIComponent(query)}`;

    const response = await fetch(proxyUrl + apiUrl, {
      headers: {
        // Parfois cors-anywhere exige un header spécifique
        'Origin': 'https://doncrypto.netlify.app',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API error with status ${response.status}`, details: text }),
      };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API fetch failed', message: error.message }),
    };
  }
};
