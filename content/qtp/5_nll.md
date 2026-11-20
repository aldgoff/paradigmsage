---
title: "Non Linear Logic (NLL)"
weight: 50
---

### Intro

This is a rich field and thus deserves its own section.
Only a few key ideas and highlights will be discussed here.

See the NLL section for further details (in progress).

### Generalized Truth Tables

A logical expression can be delineated with *truth tables*. 
There is a column for each input (variable, proposition, logic gate, etc.)
and one output column for the value of the entire expression.

However, when self-reference is admitted, it is preferable to have 
the *same number of output columns* as input columns.
In both cases the total number of rows is 2^n.

### Successor Vectors

Both the set of input columns and the set of output columns are interpreted in binary
but labeled with their decimal equivalents, which do double duty as node numbers.
The array of decimals for the output columns is called a *successor vector*.

Consider a loop of two NOT operators. Its generalized truth table looks like this.
```
         (A:~B),(B:~A)     
  +---+-------+-------+----+
  | x |  A  B | ~B ~A | Sx |
  +---+-------+-------+----+
  | 0 |  F  F |  T  T |  3 |
  | 1 |  F  T |  F  T |  1 |
  | 2 |  T  F |  T  F |  2 |
  | 3 |  T  T |  F  F |  0 |
  +---+-------+-------+----+
```

### Attractor Structures

The successor vector can be represented graphically as a directed graph called an *attractor structure*.
In the double NOT operator loop above, there are three attractors, two *singlets* (1, 2) and one *doublet* (0,3).
The singlets are fixed states, the doublet represents a contradictory proposition - a paradox with no stable value.
The attractor structures reveal immediately the nonintuitive result that nonlinear logical forms
are dominated by *multiple values* and *phase*.

### Digital Circuits

Generalized truth tables can be realized by clocked digital gates and circuits.
Every gate (or compound function constructed out of gates) is clocked.
There is one globally synchronized signal called the *clock*.
It represents the re-entrant nature of tracing nodes through the generalized truth table and/or successor vector.
The paradox frequency is one-half the clock frequency.

### Typographic Formal System

Such nonlinear logical forms can also be expressed typographically, much like the propositional calculus.
The major change is the addition of the *label operator* (:).
The NLL typographic form for the double NOT loop above is the string on top of the truth table.
Verbally, "A gets NOT B, B gets NOT A."

The fact that nonlinear logical forms are in general multi-valued and phase sensitive
presents severe challenges to constructing formal systems of proof.

### Notable Features

Without justification (see the NLL section), these are the surprises
that arise from this formalism.

* Multi-valued
* Phase sensitive
* History
  * Memory
  * Latches
* Oscillation
  * Frequency
    * A maximum possible frequency
    * The *paradox frequency*
  * Duty cycles
* Hierarchy of states
* Ground states
* Relaxation

---

*Updated 11/20/2026*

