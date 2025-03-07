const API_KEY_ARRAY = ["abc-123", "xyz-123", "abc-789", "xyz-789"];

const API_KEY_AUSNAHMEN = ["/", ".html", ".css"];

function middlewareApiKeyCheck(req, res, next) {
  const requestPfad = req.path;

  if (API_KEY_AUSNAHMEN.some(pfad => requestPfad.endsWith(pfad))) {
    return next();
  }

  const apiKey = req.query.API_KEY;

  if (!apiKey) {
    res.status(401).json({ erfolg: false, ergebnis: "Kein API-Key übergeben" });
  } else {
    if (API_KEY_ARRAY.includes(apiKey)) {
      next();
    } else {
      res.status(401).json({ erfolg: false, ergebnis: "Ungültiger API-Key" });
    }
  }
}


function middlewareLogger(req, res, next) {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
}

let requestZaehler = 0;

function middlewareRequestZaehler(req, res, next) {
  requestZaehler++;
  console.log(`Anzahl Requests: ${requestZaehler}\n`);
  next();
}

export const middleware = {
  middlewareApiKeyCheck,
  middlewareLogger,
  middlewareRequestZaehler,
};