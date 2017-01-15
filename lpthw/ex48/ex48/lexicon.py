def scan(sentence):

    # define lexicon
    directions = ['north', 'south', 'east', 'west',
                  'up', 'down', 'left', 'right', 'back']
    verbs = ['go', 'stop', 'kill', 'eat']
    stops = ['the', 'in', 'of', 'from', 'at', 'it']
    nouns = ['door', 'bear', 'princess', 'cabinet']
    
    # save words
    parsed_words = []
    
    # get list of words
    words = sentence.split()

    for word in words:    

        # flag for skipping over number/error section    
        skip_flag = False
    
        # check for direction words
        for direction in directions:
            if direction == word.lower():
                parsed_words.append(('direction', direction))
                skip_flag = True
                break
    
        # check for verbs
        for verb in verbs:
            if verb == word.lower():
                parsed_words.append(('verb', verb))
                skip_flag = True
                break
                
        # check for stops
        for stop in stops:
            if stop == word.lower():
                parsed_words.append(('stop', stop))
                skip_flag = True
                break
                
        # check for nouns
        for noun in nouns:
            if noun == word.lower():
                parsed_words.append(('noun', noun))
                skip_flag = True
                break
                
        # lazy way to check for numbers
        if not skip_flag:
            result = convert_number(word)
            if result:
                parsed_words.append(('number', result))
            else:
                parsed_words.append(('error', word))
        else:
            pass
            
    return parsed_words
    
    
def convert_number(s):
    try:
        return int(s)
    except ValueError:
        return None
