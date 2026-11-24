---
title: "Zed Chains"
weight: 100
---

### Extension

The bowtie structure is symmetric, with Alice and Bob on equal footing.
The runs are separated - let's change both of those.

Alice will be the protagonist, Bob a faithful side character 
whose whole mission is to echo back to Alice whatever she sends as soon as possible.
Thus his side of the loop shrinks.
Furthermore, the gap between runs is now eliminated, allowing them to overlap.
This allows them to be coupled so Alice may send a message to herself earlier and earlier.

```
Alice .
              .
                      .
                              .
                                      .
                                              .
                                                      .                               .
                                                              .               .       ^
                                                                      .               ^ Bob
                                                              .               .       ^
                                                      .                               .
                                              .
      .                               .
      ^       .               .
Alice ^               .
      ^       .               .                        
      .                               .
                                              .
                                                      .                               .
                                                              .               .       ^
                                                                      .               ^ Bob
                                                              .               .       ^
                                                      .                               .
                                              .
      .                               .
      ^       .               .
Alice ^               .
      ^       .               .                        
      .                               .
                                              .
                                                      .

```

We shall also increase the bandwidth from two bits to a hundred bytes.
Now Alice can send critical information into her own past.
How much trouble can we get into now?

### Noise

The noise that previously provided a defense against temporal paradox
now becomes an engineering constraint that limits message fidelity.
Both Alice and Bob need enough post-receipt time to execute error detection/correction algorithms 
prior to sending a corrected message back down the zed chain. 

These algorithms are powerful, but repeatedly copying a message without limit will eventually swamp them.
At some point the messages become too garbled to read - that is the *reach* limit.

### Reach

Reach can be extended in several ways.
The length of the superluminal channel can be increased, trading space for time.
This knob is linear.
The slope of the superluminal channel can be steepened, converting more space into time.
This knob is linear, but possibly increases noise, making the overall gains sublinear.
Increasing redundancy extends temporal reach, but at the expense of bandwidth. 
The precise relationship depends on the noise and error-correction model. 
Eventually, the available bandwidth becomes insufficient to transmit a useful message.

This is all engineering, and without real tech to achieve superluminal signaling,
we are reduced to first principles.

### Operational Example

Assume a round trip covers 1 ms, and the standard protocol is to echo an inserted message 1 million times.
That's 1,000 seconds, nearly 17 minutes.

Future-Alice inserts a message into the insertion window (one every 17 minutes).
Current-Alice (and Bob) echo it farther and farther backwards in time.
Past-Alice has been listening to white noise since the last message.
Gradually, the noise quiets down and bits and pieces of a message begin to appear.
The most redundant parts of the message become clear first.
"Accident: I-5 × I-405".
Action-Alice dispatches emergency responders.
Additional details emerge later, exact location, hazardous materials, multiple injuries, whatever.
Action-Alice can send more accurate and complete information as it becomes available.
Bit by bit the message becomes more readable.

### Entropy

The zed-chain appears to have just overturned an established principle of physics - entropy.
As current-Alice experiences time, each successive message is *clearer*.
In forward time, the uncertainty (Shannon entropy) of the echoed message is not *increasing*; it is *decreasing*. 
"Say what?"

Have we finally found a logical reason to conclude that spacelike causality is verboten?

### Degenerate Invariants

Nope. The second law of thermodynamics is stated as, "entropy increases with time."
However, we don't know if that is a correct coupling.
In modern physics, time and causality always move in the *same direction*.
So the correct law might instead be, "entropy increases with causality." 

This is an example of *degenerate invariants* – two
different principles that in a *restricted domain* produce the same outcomes.
When time and causality move in the same direction, both principles align.

However, in a zed chain, time and causality *do not flow* in the same direction.
Time flows forward, but causality flows backwards,
and in this direction, entropy is in fact increasing.
This makes sense; it is change that drives the odds, not time.
It was just a convenient way to express the principle – just a little sloppy.

Spacelike causality would make the separation of entropy from time a testable hypothesis – 
entropy would be coupled with causality, rather than with time.

---

*Updated 11/24/2026*

