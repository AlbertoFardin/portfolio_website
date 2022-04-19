## NOTE TECNICHE

**Conference** è un wrapper che contiene la logica comunicazione tra i componenti di UI e l'API di chime-sdk-js
Va ricordato che per come funziona il servizio di chime, ogni componente è già renderizzato nel DOM ma è nascosto col CSS.

- Il workflow per unirsi ad un meeting è il seguente:

1. Al cambiamento della proprietà "open" parte il workflow del componente

- `dialogStart = true`
- viene renderizzato una modale che comunica all'utente che si stanno controllando i permessi
- scatta l'effetto che controlla i permessi `audio` e `video`
  - il browser controlla i permessi di trasmissione`audio` e `video`
  - il browser chiede singolarmente l'abilitazione dei permessi
- Appare la prima dialog in cui l'utente sceglie in quale meeting unirsi
  - se vuole creare un nuovo meeting, clicca l'apposito pulsante di creazione
  - se vuole unirsi ad uno esistente, inserire l'id nell'apposito campo e continua

1. Il componente interroga il sevizio di BE, se non ci sono errori, prosegue

- viene valorizzato `conferenceNameToCreate` o `conferenceNameToJoin`
- se ci sono errori nel CREATE viene valorizzato `dialogErrorToCreate`
- se ci sono errori nel JOIN viene valorizzato `dialogErrorToJoin`

1. Appare la seconda dialog in cui l'utente può abilitare/disabilitare il proprio video ed audio prima di entrare nel meeting

- il meeting è stato creato
  - viene valorizzato `conferenceName`
  - viene istanziato il `meetingSession` e salvato nel ref
  - scatta l'effetto che aggancia il tag video alla preview locale (nella dialog)
  - scatta l'effetto che aggancia il tag video alla preview locale (nella bubble local)
  - scatta l'effetto che aggancia il tag audio
- `dialogPreview = true`
- l'utente può abilitare/disabilitare la propria webcam
- l'utente può mutare/attivare il proprio microfono
- l'utente può cliccare l'apposito pulsante per entrare nel meeting
  - `meetingStarting = true`
  - si visualizza uno spinner di loading
  - scatta l'effetto che fa entrare l'utente nel meeting

5. Appare il tool flottante che mostra i partecipanti come Bubble e permette all'utente di fare diverse azioni

- `meetingOn = true`
- scatta l'effetto che aggancia i tag video alle tiles fornite da chime
- l'utente può abilitare/disabilitare la propria webcam
- l'utente può mutare/attivare il proprio microfono
- l'utente può visualizzare/nascondere le Bubbles
- l'utente può visualizzare/nascondere il pannello delle opzioni
- l'utente può abilitare/disabilitare la modalità fullscreen
- l'utente può abilitare/disabilitare la condivisione schermo
- l'utente può uscire dal meeting
  - `meetingLeaving = true`
  - scatta l'effetto che ripulisce lo stato
