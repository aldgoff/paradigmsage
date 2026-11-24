---
title: "Bowtie Thought Experiment (BTE)"
weight: 90
---

### Paradigm

Let's review the position that spacelike causality cannot be allowed in physics.
Our tool will be a thought experiment.
Like proofs by contradiction in logic, the starting point is to assume what you wish to disprove.

### What Goes Around

Consider two spacelike separated observers Alice and Bob,
but at two different times; past-Alice and future-Alice, and past-Bob and future-Bob.
Alice and Bob share two spacelike causes, real spacelike causes, 
*not* the symmetric spacetime intervals of the previous section, those are just collapse 'causals.'

Future-Alice uses one spacelike link to send information to past-Bob,
and future-Bob uses the other spacelike link to send information to past-Alice.
That's two *spacelike* intervals.
Obviously, past-Alice can pass info to future-Alice and past-Bob can pass info to future-Bob,
by simply hanging on to whatever they received, two *timelike* intervals.
Let the 'past' observers lie along one plane of simultaneity,
and the 'future' observers lie along another plane of simultaneity.

If this closed loop is drawn on a spacetime diagram, it forms the outline of a man's formal bowtie.
The shallow slopes are the spacelike intervals, the vertical slopes are the timelike intervals.

```
      .                                                                               .
      |       .                                                               .       |
      |               .                                               .               |
      |                       .                               .                       |
      |                               .               .                               |
Alice |                                       .                                       | Bob
      |                               .               .                               |
      |                       .                               .                       |
      |               .                                               .               |
      |       .                                                               .       |
      .                                                                               .

```

### Experimental Protocol

The spacelike links have limited bandwidth, in fact just two bits.
Therefore there is a grand total of four possible messages: 00, 01, 10, 11.
Each link may send only one message.

Each spacelike link also has a native error rate, some finite amount of noise.
How much noise is an engineering detail, but the fact that it is not zero is relevant.
For all practical purposes there is no noise on the timelike links.

Each experiment consists of 100 runs, Alice and Bob send and receive 100 messages to/from each other.
Just to be concrete, assume that past-Alice is one second prior to future-Alice, ditto for Bob.
Each run takes two seconds, one second to route the messages, 
and one second just to cleanly separate the runs in time.
A complete experiment takes 200 seconds.
Each loop is independent of the others.

Each uses a local computer for sending and receiving.
The program keeps two lists: a list of sent messages and a list of received messages.
The only thing that differs between the six experiments is the computer program.

This basic protocol allows for six specific thought experiments.
In some, the loop is open, messages are created outside it and inserted.
In others, the loop is fully closed, no outside insertion of messages at all.

### Run #1 - Random Messages (Open Loop)

In experiment #1, both Alice and Bob program their computers to send *random messages*. 
They have the option of using an algorithmic pseudorandom number generator (pRNG), 
or a hardware-based quantum random number generator (qRNG). 
Regardless, program #1 pays no attention to what message was received. 
This is not a closed loop.

When the experiment is done, Alice and Bob compare their send and receive lists.
Locally, there is no correlation between their respective past and future lists.
However, if the spacelike links are working as specified,
future-Alice's send list matches past-Bob's receive list,
and future-Bob's send list matches past-Alice's receive list –
with a fidelity determined by the communication noise.

### Run #2 - Portent (Open Loop)

In experiment #2, Bob changes his program to *echo* whatever he receives.
Alice still generates and sends a random message.
The causal story goes like this:
Alice generates a random message, and then through Bob, sends it into her own past.
In the disreputable language of ESP, this is a *precog*, her received list predicts the future.
In either case, their nonlocal lists match, but in the latter case their local lists are inverted images of each other’s.

### Run #3 - Indeterminate (Closed Loop)

In experiment #3, Alice and Bob agree to run the *same* program,
either an *echo* program or an *invert* program.
Either they *both echo* the received message or they *both invert* the received message.
Neither generates a message external to the loop.

There are *no external inputs* to the bowtie, 
the spacelike and timelike intervals form a *closed causal loop* in spacetime 
with no inputs, a loop that is nonlocal, and fully self-referential. 
This is the ontological indeterminacy, the magical creation of information from nothing. 
No one chose any of the messages, they were *generated by the loop* itself. 

What should one expect out of 100 runs? 
The obvious answers are either a fixed message of two bits 100 times in a row, 
an informational message spanning the runs (200 bits), or 100 random messages each of two bits. 
An informational message would be miraculous, extraordinarily unlikely, and is summarily rejected. 
A fixed message is a logical possibility, but there is no a priori reason to prefer one to another, 
although which one was observed could depend on technical details of the equipment. 
Fine tuning those details should change the message, and unless that change were acutely discontinuous, 
it is likely at some setting to produce the third option, randomness. 
Fine tuning to achieve equal odds for each message should be regarded as part of the calibration phase of the experiment.

Therefore, the expectation is that all four messages will occur with equal frequency, 
and their distribution is hypothesized to be truly random, 
the kind we find in quantum physics, and game theory, but nowhere else. 
They have simply implemented a tortuously complicated qRNG. 
This observation suggests a potential connection between self-reference and the characteristic randomness of quantum systems.

Note the implied solution to the ontological indeterminacy: information has not been created out of nothing, 
the data is *random, not structured*. Entropy rules, thank you Shannon.

### Run #4 - Conditional (Closed Loop)

In experiment #4, Alice *echoes*, but Bob *chooses* to be sneaky; 
he programs his computer with a conditional branch.
If either 00 or 11 is received, the computer *echoes* it,
but if 01 or 10 is received, the computer *inverts* it.
For matching bits, we have an indeterminacy, but for non-matching bits we have a paradox. 
This is a *conditional paradox*, but it is also a *conditional indeterminacy*. 
From either perspective, the noisy channels give nature an easy out. 

The solutions lie along a single continuum.
On one end of the continuum *half the messages are corrupted*, 
while on the other end only *two messages show up*, 00 & 11.
Any mixture of these two extremes is also a potential outcome,
but it suffices to analyze just the two extremes.

Consider the corrupted case, where the superluminal message suffers a single bit-flip.
Assume Alice received message 00, thus she sends 00, but the low order bit flipped, so Bob received 01.
Bob inverts this and sends back 10.

In order to maintain causal consistency, the two spacelike channels must collectively flip both bits.
In this example, the high-order bit flips on the Bob-to-Alice link.

Now the loop is causally consistent.
Similar arguments apply to the other three messages.

Every observer sees a random sequence of all four messages.
Only by comparing their nonlocal lists do they see that something has changed.
For those messages that take the paradoxical branch, two things in fact change substantially.
1) The first is a drastic *increase* in the noise on each superluminal channel.
2) The second is that the noise is *correlated*, 
if there was a bit flip on channel one, there was also a bit flip on channel two.

Both of these changes are nonlocal, Alice and Bob can only ascertain their existence 
by comparing their local lists with each other - at sublight speeds.

The *intent* of the computer program is the critical factor. 
How can intent influence reality?

Now consider the other extreme case; Alice and Bob only observe two messages, 00 & 11.
Before, there was a *50% chance* the bits would match, now there is a *100% chance* they will match. 
Before, *four* equally likely messages were received, now only *two*. 
Doesn’t that imply the magical creation of information out of nothing? 
Not at all. 
While there is no explicit input of a message into the loop, there is an implicit one, the loop has changed. 
The source of the information is from the *structure of the loop*, 
changed by the introduction of a computer program that inverts half the messages.
The pathological case simply never shows up.

This is *destructive interference in spacetime*.
Bob's 'sneaky' alternative, to invert messages with different bits, is never invoked
because the triggering messages never arrive.

Going deeper, Bob's program contains an **if** statement. 
If the message is 00 or 11, it *echoes* the message. Otherwise, it *inverts* it.

Here's the rub: in this solution, the **invert** subroutine is *never executed*. 
The loop generates only 00 and 11, precisely because the alternative messages 
would invoke that subroutine and create a paradox.

In ordinary computation, a program affects reality through the instructions it executes. 
Here, an instruction that is never executed nevertheless changes the outcome. 
Its mere presence constrains which histories can occur.

The *intent* is encoded in the program, not in the consciousness of its programmer. 
Bob has specified what the computer *would do* under circumstances that never arise. 
Yet that specification has physical consequences.

This is a different kind of causality: not the execution of an instruction, 
but the exclusion of histories incompatible with its execution. 
One might call it *constraint causality*.

Replace the invert subroutine with an echo subroutine, and the restriction disappears. 
All four messages become admissible again.

If a choice encoded in an algorithm can influence physical reality without the relevant instructions ever 
being executed, then the conventional identification of causality with executed processes is incomplete.

Does this establish free will? No. 
But it suggests that the relationship between choice, self-reference, and physical causality 
may be deeper than an exclusively algorithmic account of decision-making ordinarily assumes.

Note: In a good communication channel, the error rate is low enough that double errors can be ignored
for a first-order calculation.

### Run #5 - Classic Paradox

In experiment #5, either Alice or Bob, but not both, *invert every message they receive*. 
This is the classic temporal paradox. 
Now the only option is for bits to be corrupted in transit.
Within the single bit approximation, every message, every run, but the same analysis applies. 
There is no direct cause of the increase in the noise, and the locations of the noise are entangled. 
The correlation of the sent and received messages is violated, but that is always the case when noise swamps signal. 
A quantum paradox always contains a loophole, noise, it is only at the classical level that 
paradoxes appear intractable, because of the hidden assumption of perfect causation, no noise.

This is a special case of the more general progressive paradox, where messages are mapped onto others, 
deterministically. For instance, a simple progressive paradox is 00 -> 01 ->10 -> 11 -> 00... 
These can be analysed with attractor theory.

The distribution of these errors may depend on the relative reliability of the two spacelike channels.

Introduce a *redundancy parameter*, R, representing the degree of protection against transmission errors. 
Greater redundancy means greater reliability.

Bob holds the redundancy of his channel fixed. 
Alice begins with low redundancy and progressively increases it, 
until her channel becomes much more reliable than Bob's.

If consistency-restoring errors favor the less reliable channel, 
initially most errors should occur on Alice's channel. 
As her redundancy increases, the balance should shift toward Bob's channel. 
When their effective reliabilities are equal, the errors should be distributed symmetrically.

Thus the paradox may not merely require errors; it may determine where those errors occur, 
according to the relative reliability of the available causal paths.

What gets ignored in the traditional treatment of paradox is that there are not 
*two* transmissions happening – but *four*. 
Two along spacelike intervals, the other two along timelike intervals. 
Past-Alice sends future-Alice a message, via a very low noise channel, a classical record. 
Past-Bob sends future-Bob a message, via a very low noise channel, again a classical record. 
If this record where stored instead in a quantum computer, it might have a substantial chance, 
one second later, of having suffered decoherence, and flip.

If noise is not taken into account, our logical linear rational western way of thought will tempt us 
down a primrose path where self-consistency seems impossible. 
Ignoring noise is the logical flaw, the hidden assumption of perfect information storage, 
retrieval, and transmission. 
The Grandfather Paradox is slippery, it is saved by noise, and many potential sources of noise
have been explored by professional assumption assassins – sci-fi authors. 
The time machine lands in the wrong location or time, the gun jams, granny lied he wasn’t your father’s father, 

or many worlds – he died in this one, but you still exist in the other one. 
Or, my personal favourite, the gun fires, killing granddad, but the bullet ricochets and breaks the time machine, 
no replacement parts in this time in history, the grandson is stuck in the past. 
There is a missing man, the late granddad, and an extra man, the grandson, both the same age, 
with the same genetic material, and granny was kind of cute in her youth…

Here is another variation, Bob has a side bowtie with Charlie. 
They agree to a small redundancy, and both agree to echo. 
Before choosing to echo or invert Alice’s message, Bob confers with Charlie; 
if their message has matching bits, Bob echoes, otherwise he inverts. 
Bob is using his bowtie with Charlie as a qRNG, but a noisy one, or if you will, a weak one. 
By coupling it to a stronger paradox, does that change the stats of the Bob-Charlie qRNG? 
Is it now more likely the side bowtie messages will have matching bits?

There’s a novel thought, paradoxes come in different strengths, and if so, 
it should be possible to quantify their relative strengths. 
The classical abstraction of a temporal paradox simply assumes a paradox of infinite strength. 
That is why it has seemed such a devastating argument against the possibility of closed causal loops. 
No longer. 
Noise offers a possible resolution to both the grandfather paradox and the ontological indeterminacy.

### Run #6 - Choice

In experiment #6, Alice and Bob abandon their computer programs and just prior to each run, 
*randomly choose* whether to echo or invert. 
When they make the *same* choice the loop is indeterminate and their respective lists are random but correlated, 
all messages are equally likely. 
When they make *opposite* choices the loop is paradoxical and their respective lists are random but uncorrelated, 
the loop is dominated by noise, correlated noise.
Can their choices be independent?

What assumptions are being made about free will? 
Do they have it, or just think they have it? 
Does one choice force the other to make the same choice? 
Alice and Bob are symmetric. 
Is it possible the two observers always make the same choice? 
Are their choices entangled?
Is one will stronger than another? 
Like paradox, can the strength of free will be quantified? 
Wouldn’t it be something if ‘time travel’ were intimately connected with free will? 
That should keep the philosophers busy.

If their choices were independent, the odds that both observers always made the same choice would be astronomical. 
Each might *believe* they were making free choices, 
but the statistical evidence would contradict that self-assessment.
Such a result would appear *miraculous*. 
More meat for the philosophers, and now maybe even some for the theologians.

### Conclusion

The intent of this line of inquiry was to assume a superluminal signaling capability, 
then use physics and logic to demonstrate that the assumption was untenable.

That is not how the argument worked out.

Across six thought experiments, closed causal loops presented indeterminacy, conditional constraints, 
paradoxes, and even questions about free will. 
Yet in each case, logically consistent outcomes remained possible, provided we allowed imperfect communication, 
imperfect records, or constraints on the histories that could occur.

The appearance of an intractable paradox depended on a hidden assumption: 
perfect causality — noiseless communication, flawless record keeping, 
and the certainty that every intended action would occur exactly as specified.

Removing that assumption does not establish that spacelike causality exists, 
nor does it tell us how nature would select among consistent outcomes.

But it does undermine the claim that temporal paradoxes alone are sufficient to rule out spacelike causality.

**A paradox is not a proof of impossibility when its premises exclude the very mechanisms that might resolve it**.

---

*Updated 11/23/2026*

