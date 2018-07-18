import _ from 'lodash';
import faker from 'faker';

export const generateData = function() {
    return {
        currentUserDetails:{
            username: faker.internet.userName(),
            name: faker.name.findName(),
            avatar: faker.internet.avatar()
        } 

    }
}