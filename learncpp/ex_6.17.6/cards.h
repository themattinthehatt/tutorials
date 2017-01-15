#ifndef CARDS_H
#define CARDS_H

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

    enum CardSuit
    {
        SUIT_CLUB,
        SUIT_DIAMOND,
        SUIT_HEART,
        SUIT_SPADE,
        MAX_SUITS
    };

    struct Card
    {
        CardRank rank;
        CardSuit suit;
    };

    void printCard(const Card &card)
    {
        char card_rank;
        char card_suit;

        switch (card.rank)
        {
            case RANK_2:
                card_rank = '2';
                break;
            case RANK_3:
                card_rank = '3';
                break;
            case RANK_4:
                card_rank = '4';
                break;
            case RANK_5:
                card_rank = '5';
                break;
            case RANK_6:
                card_rank = '6';
                break;
            case RANK_7:
                card_rank = '7';
                break;
            case RANK_8:
                card_rank = '8';
                break;
            case RANK_9:
                card_rank = '9';
                break;
            case RANK_10:
                card_rank = '9';
                break;
            case RANK_JACK:
                card_rank = 'J';
                break;
            case RANK_QUEEN:
                card_rank = 'Q';
                break;
            case RANK_KING:
                card_rank = 'K';
                break;
            case RANK_ACE:
                card_rank = 'A';
                break;
            default:
                std::cout << "Invalid card rank given!" << std::endl;
                card_rank = 'X';
        }

        switch (card.suit)
        {
            case SUIT_CLUB:
                card_suit = 'C';
                break;
            case SUIT_DIAMOND:
                card_suit = 'D';
                break;
            case SUIT_HEART:
                card_suit = 'H';
                break;
            case SUIT_SPADE:
                card_suit = 'S';
                break;
            default:
                std::cout << "Invalid card suit given!" << std::endl;
                card_suit = 'X';
        }

        std::cout << card_rank << card_suit;
    }

    void printDeck(const std::array<Card, 52> &deck)
    {
        for (const auto &card : deck)
        {
            printCard(card);
            std::cout << ' ';
        }
    }

    void swapCards(Card &card1, Card &card2)
    {
        Card temp = card1;
        card1 = card2;
        card2 = temp;
    }

    void shuffleDeck(std::array<Card, 52> &deck)
    {
        srand(static_cast<unsigned int>(time(0)));
        int rand_card;
        for (auto &card : deck)
        {
            // pick a random number between 0 and 51
            rand_card = rand() % 52;
            swapCards(card, deck[rand_card]);
        }
    }

    int getCardValue(const Card &card)
    {
        switch (card.rank)
        {
            case RANK_2:
                return 2;
            case RANK_3:
                return 3;
            case RANK_4:
                return 4;
            case RANK_5:
                return 5;
            case RANK_6:
                return 6;
            case RANK_7:
                return 7;
            case RANK_8:
                return 8;
            case RANK_9:
                return 9;
            case RANK_10:
            case RANK_JACK:
            case RANK_QUEEN:
            case RANK_KING:
                return 10;
            case RANK_ACE:
                return 11;
            default:
                std::cout << "Invalid card rank given!" << std::endl;
                return -1;
        }
    }

#endif
