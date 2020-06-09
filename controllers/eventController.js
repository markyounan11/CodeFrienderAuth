const { User, Event } = require('../models/index');

module.exports = {
  getEvent: async (req, res) => {
    try {
      const events = await Event.find({ attending: req.user._id });

      return res.json(events);
    } catch (e) {
      return res.status(403).json({ e });
    }
  },
  createEvent: async (req, res) => {
    const {
      title,
      date,
      time,
      location,
      description,
      pin,

    } = req.body;
    if (!pin) {
      return res
        .status(400)
        .json({ error: "You must input an invite code!" });
    }
    try {
      const existingPin = await Event.findOne({
        pin,
        userName: req.user.userName,
      });
      if (existingPin) {
        return res.status(403).json({ error: "code already in use, please provide a different pin" });
      }

      const newEvent = await new Event({
        title,
        date,
        time,
        location,
        description,
        pin,
        host: req.user._id,
        userName: req.user.userName,
      }).save();

      const newEventId = newEvent._id;

      // pushing the userID into the attending field
      const updateAttending = await Event.findByIdAndUpdate(newEventId, {
        $push: { attending: req.user._id },
      });
      return res.status(200).json(updateAttending);
    } catch (e) {
      return res.status(403).json({ e });
    }
  },
  specificEvent: async (req, res) => {
    const { eventId } = req.params;

    try {
      const eventFound = await Event.findById(eventId).populate("attending");

      return res.json(eventFound);
    } catch (e) {
      return res.status(403).json({ e });
    }
  },
  deleteEvent: async (req, res) => {
    const { eventId } = req.params;

    try {
      const eventToDelete = await Event.findById(eventId);
      if (!eventToDelete) {
        return res
          .status(401)
          .json({ error: "That event had already been deleted" });
      }
      if (req.user._id.toString() !== eventToDelete.host.toString()) {
        // considering checking (if this is true maybe we just remove you from attendance array instead of deleting the event)
        await Event.findByIdAndUpdate(eventId, {
          $pull: { attending: req.user._id },
        });
        return res.json(eventToDelete);
      }

      const deletedEvent = await Event.findByIdAndDelete(eventId);
      return res.json(deletedEvent);
    } catch (e) {
      return res.status(403).json({ e });
    }
  },
  updateTitle: async (req, res) => {
    const { eventId } = req.params;
    const { title } = req.body;
    try {
      const joinAttending = await Event.findByIdAndUpdate(
        eventId,
        { title },
        { new: true },
      );
      return res.json(joinAttending);
    } catch (e) {
      return res.status(403).json({ e });
    }
  },
  updateDescription: async (req, res) => {
    const { eventId } = req.params;
    const { description } = req.body;
    try {
      const joinAttending = await Event.findByIdAndUpdate(
        eventId,
        { description },
        { new: true }
      );
      return res.json(joinAttending);
    } catch (e) {
      return res.status(403).json({ e });
    }
  },
  updateLocation: async (req, res) => {
    const { eventId } = req.params;
    const { location } = req.body;
    try {
      const joinAttending = await Event.findByIdAndUpdate(
        eventId,
        { directions: location },
        { new: true },
      );
      return res.json(joinAttending);
    } catch (e) {
      return res.status(403).json({ e });
    }
  },

};
