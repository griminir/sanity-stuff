*[_type == 'event' &&
eventType == 'in-person' &&
date < now()]{
name,
"lead_artist":headline->{name},
"alreadyHappened": true
}
