# How to grant users

```
db.createUser(
   {
     user: "",
     pwd: "",
     roles:
       [
         { role: "readWrite", db: "", collection: "" },
       ]
   }
)

show users
```
