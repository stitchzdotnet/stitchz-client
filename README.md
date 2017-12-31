# stitchz-client

The [Stitchz.net](https://www.stitchz.net/Features) client for use on front end
web login pages.

## Install

```bash
$	npm install stitchz-client
```

## Usage / Examples

In a reactJS application, on your login page...

```js
componentDidMount() {
		StitchzClient.ready(() => {
			StitchzClient.AddIframeToDOM({
				ApiKey: '00112233445566778899',
				ReturnUrl: 'http://localhost:3000/oauth/authorize',
				Height: '280', // optional
				Width: '330', // optional
				MaxHeight: '768', // optional
				MaxWidth: '500', // optional
				AutoResize: true, // optional
				AppURL: 'https://example.stitchz.net',
				Version: 2,
				HtmlElementIdNameToAddIframeTo: 'stitchzsociallogin'
			});
		});
	} // componentDidMount
```

To directly add the client to html code...

```html
<div id="stitchzsociallogin">

</div>

<script src="/Scripts/stitchz.client.js" type="text/javascript"></script>
<script type="text/javascript">
    StitchzClient.ready(function (e) {
        StitchzClient.AddIframeToDOM({
            ApiKey: '00112233445566778899',
            ReturnUrl: 'http://localhost:3000/oauth/authorize',
            Height: '280', // optional
            Width: '330', // optional
            MaxHeight: '768', // optional
            MaxWidth: '500', // optional
            AutoResize: true, // optional
            AppURL: 'https://example.stitchz.net',
            Version: 2,
            HtmlElementIdNameToAddIframeTo: 'stitchzsociallogin'
        });
    });
</script>
```

## Documentation

For more information about [Stitchz](https://www.stitchz.com), including 
available profile properties, visit our [documentation page](https://www.stitchz.com/documentation).

## Author

[stitchzdotnet](http://github.com/stitchzdotnet)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

Copyright (c) 2017-2018 Stitchz <[https://www.stitchz.net/](https://www.stitchz.net/)>