#include <iostream>
#include <ctime>
#include <cstdlib>

void initSeed()
{
    srand(static_cast<unsigned int>(time(0)));
}

int getRand(int lo, int hi)
{
    int r = rand();
    return r % (hi - lo) + lo;
}

int getGuess()
{
    using std::cout;
    using std::cin;
    using std::endl;

    while(1)
    {
        int ans;
        cin >> ans;
        if (cin.fail()) // has a previous extraction failed?
        {
            // yep, so lets handle the failure
            cin.clear(); // put us back in the 'normal' operation mode
            cin.ignore(32767, '\n'); // clear (up to 32767) characters out of the
                                      // buffer until a '\n' character is removed
            cout << "Invalid guess; try again." << endl;
        }
        else
        {
            // nope, so return out good char
            cin.ignore(32767, '\n'); // remove extraneous input
            return ans;
        }
    }
}

void playHiLo()
{

    using std::cout;
    using std::endl;

    bool lose_flag = true;
    int num_tries = 7;
    int number = getRand(1, 100);
    int guess;

    cout << "Let's play a game. I'm thinking of a number. You have "
         << num_tries << " tries to guess what it is." << endl;

    for (int i = 0; i < num_tries; i++)
    {
        guess = getGuess();

        cout << "Guess #" << i + 1 << ": " << guess << endl;
        if (guess > number)
            cout << "Your guess is too high." << endl;
        else if (guess < number)
            cout << "Your guess is too low." << endl;
        else if (guess == number)
        {
            cout << "Correct! You win!" << endl;
            lose_flag = false;
            break;
        }
    }

    if (lose_flag)
        cout << "Sorry, you lose. The correct number was " << number << endl;

}

void playAgainPrompt()
{

    using std::cout;
    using std::cin;
    using std::endl;

    while(1)
    {
        cout << "Would you like to play again (y/n)?" << endl;
        char ans;
        cin >> ans;
        if (cin.fail()) // has a previous extraction failed?
        {
            // yep, so lets handle the failure
            cin.clear(); // put us back in the 'normal' operation mode
            cin.ignore(32767, '\n'); // clear (up to 32767) characters out of the
                                      // buffer until a '\n' character is removed
        }
        else
        {
            // nope, so return out good char
            cin.ignore(32767, '\n'); // remove extraneous input
            if (ans == 'n')
                exit(0);
            else if (ans == 'y')
                return;

        }
    }
}

int main()
{

    initSeed();

    while(1)
    {
        playHiLo();
        playAgainPrompt();
    }

    return 0;
}
