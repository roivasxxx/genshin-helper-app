# Custom collection endpoint without collection auth settings

Add this code to **payload.config.ts**, alternatively create a route inside server.ts
Example:
Ddding this endpoint inside of the Users.ts collection file would not work, cause the auth settings for the collection would block it
this way we can make that the endpoint is available in the collection generated api route without the auth settings

```
endpoints: [
        {
            path: "/api/users/test",
            method: "get",
            handler: (req, res) => {
                res.send(200).send("OK");
            },
            root: true,
            // removes payload auth options etc.
        },
    ],
```

https://www.youtube.com/watch?v=HYO8OuLuTFw

# payloadcms json field - nested object => type:"group", fields:[...]

# payloadcms getting current document fields from a custom field using: const [fields, dispatchFields] = useAllFormFields();
