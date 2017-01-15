#ifndef DECK_H
#define DECK_H

#include <array>
#include "Card.h"

class Deck
{
private:
    std::array<Card, 52> deck;
    int cardIndex = 0;

    // Generate a random number between min and max (inclusive)
    // Assumes srand() has already been called
    static int getRandomNumber(int min, int max)
    {
    	static const double fraction = 1.0 / (static_cast<double>(RAND_MAX) + 1.0);  // static used for efficiency, so we only calculate this value once
     	// evenly distribute the random number across our range
    	return static_cast<int>(rand() * fraction * (max - min + 1) + min);
    }

    static void swapCard(Card &a, Card &b)
    {
    	Card temp = a;
    	a = b;
    	b = temp;
    }

public:
    Deck()
    {
        // We could initialize each card individually, but that would be a pain.  Let's use a loop.
        int card = 0;
        for (int suit = 0; suit < Card::MAX_SUITS; ++suit)
        for (int rank = 0; rank < Card::MAX_RANKS; ++rank)
        {
            deck[card] = Card(static_cast<Card::CardRank>(rank),
                              static_cast<Card::CardSuit>(suit));
            ++card;
        }
    }

    void printDeck()
    {
    	for (const auto &card : deck)
    	{
    		card.printCard();
    		std::cout << ' ';
    	}

    	std::cout << '\n';
    }

    void shuffleDeck()
    {
    	// Step through each card in the deck
    	for (int index = 0; index < 52; ++index)
    	{
    		// Pick a random card, any card
    		int swapIndex = getRandomNumber(0, 51);
    		// Swap it with the current card
    		swapCard(deck[index], deck[swapIndex]);
    	}

    	cardIndex = 0;
    }

    const Card& dealCard()
    {
        cardIndex = cardIndex % 52;
        return deck[cardIndex++];
    }

};
#endif // DECK_H
