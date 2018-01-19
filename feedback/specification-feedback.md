Project Specification Feedback
==================

Commit graded: 

### The product backlog (10/10)
The backlog could be better formatted in a table. It also helps you build sprint backlogs later on and distribute work among team members. You can find product backlog templates online. 
If every player is in the same global game, does everyone share the same map as well? Will a new player be able to join th game while some other players have already started, or do they have to wait to be matched to a new game where everyone starts at the same time?
Is your map generated randomly?
You should think about how to handle the case where a player gets disconnected to their game due to various reasons. You could save the state of the game every X amount of time so the server could reload the last checkpoint before the user gets disconnected. This requires more data models.
Having some player use keyboard control while others use voice control seems a bit unfair. You might want to separate these players and have two leader boards.

### Data models (10/10)
You might want to save the state of a game every so often so people can reconnect, which requires additional models.

### Wireframes or mock-ups (10/10)

### Additional Information

---
#### Total score (30/30)
---
Graded by: Harry Cheng (lcheng1@andrew.cmu.edu)

To view this file with formatting, visit the following page: https://github.com/CMU-Web-Application-Development/Team302/blob/master/feedback/specification-feedback.md
