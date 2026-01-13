---
title: "Paradox"
nav-entry: "Ch 2"
type: "serial"
order: "02"
date: "2026-01-12"
documents:
  discourse:
    title: "Self-Reference"
    version: "10"
  chapter:
    title: "Paradox"
    version: "14"
source:
  format: "docx"
  id: "Ch02 Paradox"
  version: "14"
params:
  role: "ch"
  nickname: "Ch 2 - Paradox"
---


**Chapter 2 - Paradox**

## Portent
  Self-reference has been at the heart of the major limit theorems of the last century,
  from Russell's paradox in set theory, to Gödel's incompleteness theorems in math, 
  to the halting problem in software engineering.
  In any sufficiently complex system, self-reference intrudes, unwanted, unwelcome, and unexpected,
  violating assumptions we were absolutely certain of.
  It is the ultimate revealer of paradigm barriers.

  A first attack was achieved last century by G. Spencer-Browns in his seminal work, *The Laws of Form* 
  where he solved the logical paradox problem by introducing **imaginary truthvalues**.
  Their applicability to quantum systems is one of the theses of this work.

## Primary Docs
  **Paradigm Discourse:**  
  <a href="/paradigmsage/assets/pop/pdf/PD02-SelfReference_10.pdf" target="_blank" rel="noopener">
    Open the *Self-Reference* discourse in next tab
  </a>

  **Technical Chapter:**  
  <a href="/paradigmsage/assets/pop/pdf/Ch02-Paradox_14.pdf" target="_blank" rel="noopener">
    Open the *Paradox* chapter in next tab
  </a>

## Significance
  Boolean and Imaginary truthvalues form cojugate bases for logic.
  Can that property be exploited to understand conjugate bases in quantum physics?
  Logic and quantum theory may share structural constraints, not just metaphors.
  Thus, the title of this book, *The Paradigm of Paradox*.


--------------------------------------------------
DEPRECATED

--------------------------------------------------

**Chapter 2**

### Paradox

<img
  src="/paradigmsage/assets/pop/ch/media/ch-02-portent.png"
  alt="Portent 2 — Logic"
  style="width: 100%; height: auto;"
/>

*Credit -- Fox Trot: "Logic" (need permission)*

This statement is true.

This statement is false.

These two statements form the foundation for an extension of logic. Both are self-referential, with essentially the same form, just a phase inversion. However, the phase inversion is critical to the analysis of whether or not such statements should be allowed in formal logic. In the first form, *either* true or false works; while in the later, *neither* true nor false works. The first statement is indeterminate; the second statement is paradoxical. The conundrum occurs because they've been allowed to refer to themselves.

Recall Dogma's plaintive complaint from the first discourse, "how could neither of the only two options be right; how could both be wrong?"

From the perspective of a paradigm shift, the answer is in the question -- there must be more than two options.

Let us therefore *invent* additional options.

It's been done before; in fact, it has been done a *lot* before. Consider the self-referential equation

$x = \frac{- 1}{x}$ (1)

Clearly x must be some form of unity, but neither +1 nor -1 is a solution. If we try +1 on the right, it yields -1 on the left, and if we try -1 on the right, it yields +1 on the left; just like the Liar's paradox. If it's true, it's false; if it's false, it's true. The answer is trying to oscillate. Many a happy hour can be spent this way.

If we want to pretend that solutions to these kinds of equations exist, then a new type of number must be invented. They are called the imaginaries. To proceed formally, multiply each side by x and take the square root.

$x = \sqrt{- 1}$ (2)

Since there are no real numbers that when multiplied by themselves yield a negative number, there are no solutions to this equation over the reals. By fiat, the square root of minus one is taken as the basis of the imaginaries, given the symbol i (for imaginary), and defined as the positive square root of minus 1.

$i = \sqrt{- 1}$ (3)

Recall that square roots are actually dual-valued, so both +i and -i are solutions.

Imaginaries are absolutely essential in modern mathematics and many technical disciplines make use of them. For instance, imaginary numbers are essential in the formulation of electromagnetic theory. A quirky fact is that in that field electrical current is indicated by 'I', so to avoid confusion imaginary numbers are indicated by ±j, rather than by ±i.

This can be a tad confusing to those who must work in both disciplines, but for the purposes of inventing new types of truthvalues the existence of two standards provides a natural nomenclature.

Let i be imaginary true, and j be imaginary false.

After all, if there is room for two standards then there is certainly room for three.

To complete the nomenclature let T represent Boolean true, and F represent Boolean false. A linguistic trick is being used here for pedagogical reasons; the Boolean truthvalues are represented with uppercase letters (T, F), while the imaginary truthvalues are represented with lowercase letters (i, j).

But does this invention make sense? Why two new truthvalues, why not just one, or three? Some justification for this choice is required. To provide such justification, consider this equation

$x = \frac{+ 1}{x}$ (4)

If either imaginary number (+i, -i) is tried, it yields the other one. This exactly parallels what happened when the reals were tried in equation (1). When either real unity (+1, -1) was substituted for x on the right side it yielded a value for x on the left side that was the other value (-1, +1). Equation (1) is contradictory over the reals, but dual-valued over the imaginaries, while equation (4) is contradictory over the imaginaries, but dual-valued over the reals. They beautifully complement each other.

Equation (4) is the analog to the first sentence of this chapter, while equation (1) is the analog to the second sentence.

To maintain this complementary relationship in the translation from math to logic, it is required to introduce two unary operators, [not]{.smallcaps} and [buf]{.smallcaps}. The intent of the [not]{.smallcaps} operator is to perform negation, and the intent of the [buf]{.smallcaps} operator (short for buffer) is to perform duplication. As is well known, [not]{.smallcaps} T is F, and [not]{.smallcaps} F is T, and it should be obvious that [buf]{.smallcaps} T is T, and [buf]{.smallcaps} F is F. The surprise is that [not]{.smallcaps} i is i, and [not]{.smallcaps} j is j, just the opposite of the case for the Boolean truthvalues, with the further inversion that [buf]{.smallcaps} i is j, and [buf]{.smallcaps} j is i, again opposite. With this formal notation it is now trivial to evaluate each of the two self-referential statements in both sets of truthvalues. For clarity, the evaluations are presented in a table.

| **Self-referential Statement**  | **Boolean Truthvalues**     | **Imaginary Truthvalues**    |
|:------------------------------- |:--------------------------- |:---------------------------- |
| This statement is true.         | Indeterminate over T & F    | Paradoxical over i & j       |
| This statement is false.        | Paradoxical over T & F      | Indeterminate over i & j     |

> Table 2-1: **Evaluation of the basic self-referential statements** -- Each self-referential statement is paradoxical in one truthvalue basis, but indeterminate in the other.

That suggests something. The Boolean truthvalues (T, F) form a basis set. So do the imaginary truthvalues (i, j). Indeed, they jointly form a pair of conjugate basis sets.

This development will find application in the upcoming discussions on quantum mechanics. But first a review of relativity.
