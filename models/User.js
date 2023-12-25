const { Schema, model } = require('mongoose');

const userSchema = new Schema (
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ],    
  },
  // virtual 
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// vitual to get length of friends array
userSchema.virtual('friendCount')
.get(function() {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
