# AGDQ Tracker Uplot

## Local development

1. Run `pnpm i`
1. Run `pnpm run dev`
1. Visit `localhost:5000/comp/index`
1. Intercept backend calls for data. Following is an example for the Tweak browser extension
   1. Enter `comp.json` in the URL field
   1. Get the response body from the call on the real website (via F12 Dev console -> Network tab -> comp.json request)
   1. Enter the response body from the real call as response body in the intercepted call
   1. Activate the extension
   1. Reload the page