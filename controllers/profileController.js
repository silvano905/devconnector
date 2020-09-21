const express = require('express');
const Profile = require('../models/Profile')
const User = require('../models/User')
const normalize = require('normalize-url');
const axios = require('axios');
const config = require('config');


module.exports.add_profile = async (req, res) =>{

    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
    } = req.body;

    //Build profile object
    const profileFields = {
        user: req.user,
        company,
        location,
        website: website && website !== '' ? normalize(website, { forceHttps: true }) : '',
        bio,
        skills: Array.isArray(skills)
            ? skills
            : skills.split(',').map((skill) => ' ' + skill.trim()),
        status,
        githubusername
    };

    // Build social object and add to profileFields
    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    for (const [key, value] of Object.entries(socialfields)) {
        if (value && value.length > 0)
            socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;

    try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
            { user: req.user },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};




// @route    GET api/profile
// @desc     Get all profiles
// @access   Public

module.exports.get_all_profiles = async (req, res) =>{

    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};



// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

module.exports.get_profile_byId = async (req, res) =>{

    try {
        const profile = await Profile.findOne({
            user: user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
    }

};




// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private

module.exports.delete_profile = async (req, res) =>{

    try {
        // Remove user posts
        // await Post.deleteMany({ user: req.user });
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user });
        // Remove user
        await User.findOneAndRemove({ _id: req.user });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};



// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private

module.exports.add_experience = async (req, res) =>{

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user });
        //same thing as push
        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};




// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

module.exports.delete_experience = async (req, res) =>{

    try {
        const foundProfile = await Profile.findOne({ user: req.user });

        foundProfile.experience = foundProfile.experience.filter(
            (exp) => exp._id.toString() !== req.params.exp_id
        );

        await foundProfile.save();
        return res.status(200).json(foundProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }

};




// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private

module.exports.add_education = async (req, res) =>{

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user });

        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};




// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

module.exports.delete_education = async (req, res) =>{

    try {
        const foundProfile = await Profile.findOne({ user: req.user });
        foundProfile.education = foundProfile.education.filter(
            (edu) => edu._id.toString() !== req.params.edu_id
        );
        await foundProfile.save();
        return res.status(200).json(foundProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }

};






// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public

module.exports.github = async (req, res) =>{

    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`
        );
        const headers = {
            'user-agent': 'node.js',
        };

        const gitHubResponse = await axios.get(uri, { headers });
        return res.json(gitHubResponse.data);
    } catch (err) {
        console.error(err.message);
        return res.status(404).json({ msg: 'No Github profile found' });
    }

};





module.exports.my_profile = async (req, res) =>{

    try {
        const profile = await Profile.findOne({user: req.user}).populate('user', ['name', 'avatar'])
        if(!profile){
            return res.status(400).json({msg: 'there is no profile for this user'})
        }
        res.json(profile);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }

};



