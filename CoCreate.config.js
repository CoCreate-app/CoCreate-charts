module.exports = {
    "config": {
        "apiKey": "2061acef-0451-4545-f754-60cf8160",
        "organization_id": "5ff747727005da1c272740ab",
        "host": "general.cocreate.app"
    },
    
    "sources": [{
            "entry": "./docs/index.html",
            "collection": "files",
            "document_id": "602738ed5e697f4f26a98a59",
            "key": "src",
            "document": {
                "name": "index.html",
                "path": "/docs/charts/index.html",
                "domains": [
                    "*",
                    "general.cocreate.app"
                ],
                "directory": "/docs/charts",
                "content-type": "text/html",
                "public": "true",
                "website_id": "5ffbceb7f11d2d00103c4535"
            }
        }
    ],

	"extract": {
		"directory": "./src/",
		"extensions": [
			"js",
			"css",
			"html"
		],
		"ignores": [
			"node_modules",
			"vendor",
			"bower_components",
			"archive"
		]
	}
}

