#include <iostream>
#include <array>
#include <stdlib.h>
#include <time.h>
#include "cards.h"

bool playBlackjack(std::array<Card, 52> &deck)
{
    Card *card_ptr = &deck[0];

    int score_player = 0;
    int score_dealer = 0;

    bool bust_player = false;
    bool bust_dealer = false;

    bool stand_player = false;
    bool stand_dealer = false;

    bool win_player = false;

    // dealer gets one card to start
    score_dealer += getCardValue(*card_ptr++);

    // player gets two cards to start
    score_player += getCardValue(*card_ptr++);
    score_player += getCardValue(*card_ptr++);

    // player turn
    char player_move = 'n';
    std::cout << "Ready Player One!" << std::endl;
    while (!stand_player && !bust_player)
    {
        std::cout << "Your current hand is: " << score_player << std::endl;
        std::cout << "Would you like to hit [y/n]? ";
        std::cin >> player_move;

        if (player_move == 'y')
        {
            score_player += getCardValue(*card_ptr++);
            if (score_player > 21)
            {
                bust_player = true;
                std::cout << "Bust! Your current hand is: " << score_player << std::endl;
            }
        }
        else if (player_move == 'n')
            stand_player = true;
        else
            std::cout << player_move << " is not a valid input. Try again." << std::endl;
    }
    std::cout << std::endl;

    // dealer turn
    if (!bust_player) // dealer doesn't need to play if player already lost
    {
        std::cout << "Dealer's Turn" << std::endl;
        std::cout << "Dealer's current hand is: " << score_dealer << std::endl;
        while (!stand_dealer && !bust_dealer)
        {
            score_dealer += getCardValue(*card_ptr++);
            if (score_dealer > 21)
            {
                bust_dealer = true;
                std::cout << "Dealer Busts! Current hand is: " << score_dealer << std::endl;
            }
            else if (score_dealer >= 17)
            {
                stand_dealer = true;
                std::cout << "Dealer stands. Current hand is: " << score_dealer << std::endl;
            }
            else
                std::cout << "Dealer survives. Current hand is: " << score_dealer << std::endl;
        }
        std::cout << std::endl;
    }

    // determine winner
    if (bust_player)
        win_player = false;
    else if (bust_dealer)
        win_player = true;
    else if (score_player > score_dealer)
        win_player = true;
    else
        win_player = false;

    return win_player;
}

int main()
{

    char play_again = 'n';

    do
    {
        // define deck
        std::array<Card, 52> deck;
        int card = 0;
        for (int suit = 0; suit < MAX_SUITS; suit++)
        {
            for (int rank = 0; rank < MAX_RANKS; rank++)
            {
                deck[card].rank = static_cast<CardRank>(rank);
                deck[card].suit = static_cast<CardSuit>(suit);
                card++;
            }
        }

        shuffleDeck(deck);

        // play game
        bool win = playBlackjack(deck);

        // print results
        if (win)
            std::cout << "Congratulations, you win!" << std::endl;
        else
            std::cout << "Dealer wins! Better luck next time." << std::endl;

        // play again?
        std::cout << "\nWould you like to play again [y/n]? ";
        std::cin >> play_again;
        std::cout << std::endl;

    } while (play_again == 'y');

    return 0;
}

// check swapCards
//std::cout << "Card 4 is: " << std::endl;
//printCard(deck[4]);
//std::cout << std::endl;
//std::cout << "Card 44 is " << std::endl;
//printCard(deck[44]);
//std::cout << std::endl;
//
//swapCards(deck[4], deck[44]);
//
//std::cout << "Card 4 is: " << std::endl;
//printCard(deck[4]);
//std::cout << std::endl;
//std::cout << "Card 44 is " << std::endl;
//printCard(deck[44]);
//std::cout << std::endl;
