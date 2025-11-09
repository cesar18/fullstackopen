```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: add node passed on body to notes
    server-->>browser: HTML staus code 201
    deactivate server
    Note right of browser: redraws notes
```
