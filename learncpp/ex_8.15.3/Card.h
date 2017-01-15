#ifndef CARD_H
#define CARD_H

class Card
{
public:

    enum CardSuit
    {
    	SUIT_CLUB,
    	SUIT_DIAMOND,
    	SUIT_HEART,
    	SUIT_SPADE,
    	MAX_SUITS
    };

    enum CardRank
    {
    	RANK_2,
    	RANK_3,
    	RANK_4,
    	RANK_5,
    	RANK_6,
    	RANK_7,
    	RANK_8,
    	RANK_9,
    	RANK_10,
    	RANK_JACK,
    	RANK_QUEEN,
    	RANK_KING,
    	RANK_ACE,
    	MAX_RANKS
    };

private:
    CardRank rank;
    CardSuit suit;

public:
    Card(CardRank rank_=MAX_RANKS, CardSuit suit_=MAX_SUITS)
    {
    	rank = rank_;
    	suit = suit_;
    }

    void printCard() const
    {
    	switch (rank)
    	{
    		case RANK_2:		std::cout << '2'; break;
    		case RANK_3:		std::cout << '3'; break;
    		case RANK_4:		std::cout << '4'; break;
    		case RANK_5:		std::cout << '5'; break;
    		case RANK_6:		std::cout << '6'; break;
    		case RANK_7:		std::cout << '7'; break;
    		case RANK_8:		std::cout << '8'; break;
    		case RANK_9:		std::cout << '9'; break;
    		case RANK_10:		std::cout << 'T'; break;
    		case RANK_JACK:		std::cout << 'J'; break;
    		case RANK_QUEEN:	std::cout << 'Q'; break;
    		case RANK_KING:		std::cout << 'K'; break;
    		case RANK_ACE:		std::cout << 'A'; break;
    	}

    	switch (suit)
    	{
    		case SUIT_CLUB:		std::cout << 'C'; break;
    		case SUIT_DIAMOND:	std::cout << 'D'; break;
    		case SUIT_HEART:	std::cout << 'H'; break;
    		case SUIT_SPADE:	std::cout << 'S'; break;
    	}
    }

    int getCardValue() const
    {
    	switch (rank)
    	{
    	case RANK_2:		return 2;
    	case RANK_3:		return 3;
    	case RANK_4:		return 4;
    	case RANK_5:		return 5;
    	case RANK_6:		return 6;
    	case RANK_7:		return 7;
    	case RANK_8:		return 8;
    	case RANK_9:		return 9;
    	case RANK_10:		return 10;
    	case RANK_JACK:		return 10;
    	case RANK_QUEEN:	return 10;
    	case RANK_KING:		return 10;
    	case RANK_ACE:		return 11;
    	}

    	return 0;
    }

};

#endif
