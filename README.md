Datenmodell für das Bibliotheksprojekt

Einleitung

Dieses Projekt dient der Verwaltung einer Bibliothek. Es ermöglicht das Speichern und Verwalten von Büchern, Autoren und deren Ausleihen. Die Struktur wurde so gestaltet, dass die wichtigsten Beziehungen und Entitäten einer typischen Bibliothek erfasst werden.



Entitäten und Attribute

Buch

ISBN: String (Primärschlüssel)
Titel: String
Veröffentlichungsjahr: Integer
Genre: String
Verfügbarkeit: Boolean
Autor-ID: String (Fremdschlüssel)

Autor

Autor-ID: String (Primärschlüssel)
Name: String
Geburtsdatum: Date
Nationalität: String

Ausleihe

Ausleihe-ID: String (Primärschlüssel)
Buch-ID: String (Fremdschlüssel)
Ausleihdatum: Date
Rückgabedatum: Date
Benutzername: String

Beziehungen

- Ein Autor kann mehrere Bücher schreiben (1:n-Beziehung)
- Ein Buch kann in mehreren Ausleihen vorkommen (1:n-Beziehung)



E/R-Diagramm

Das folgende Diagramm zeigt die Beziehungen zwischen den Entitäten Buch, Autor und Ausleihe:



Besonderheiten

Der Primärschlüssel für Autor ist ein String, um einfache Integration mit externen Systemen zu ermöglichen.
Die ISBN dient als eindeutige Identifikation eines Buches.
Die Ausleihe-ID stellt sicher, dass jede Ausleihe eindeutig referenzierbar ist.
Bei der Implementierung wurde auf klare Beziehungen zwischen den Entitäten und eine saubere Trennung der Verantwortlichkeiten geachtet.
