// SPDX-License-Identifier: Proprietary
// Copyright (c) 2025 EmpowerTours. All rights reserved.
// This software is proprietary and confidential. Unauthorized copying, distribution, or use is prohibited.

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleVibraniom is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Strings for uint256;
    using SafeERC20 for IERC20;

    IERC20 public toursToken; // $TOURS token

    enum UserType { None, Listener, Artist }

    struct UserProfile {
        UserType userType;
        uint8[] recentMoods;
        uint256 subscriptionEnd; // Timestamp when subscription ends
    }

    struct MusicNFT {
        string uri; // IPFS URI for music file
        string title; // Song title
        string artistName; // Artist name
        string coverImage; // IPFS URI for cover image
        uint8[] moodCategories; // Mood categories (e.g., 0: Calm, 1: Energetic)
        address artist; // Artist wallet address
        uint256 price; // Price in $TOURS for purchase
        uint256 streamCount; // Tracking streams
    }

    mapping(address => UserProfile) public profiles;
    mapping(uint256 => MusicNFT) public musicNFTs;
    mapping(uint256 => mapping(uint8 => uint256)) public emojiRatings;

    uint256 private _nextTokenId;
    uint256 public constant REGISTRATION_FEE = 1 ether; // 1 MON
    uint256 public constant UPLOAD_FEE = 1 ether; // 1 MON
    uint256 public constant DAILY_SUBSCRIPTION_FEE = 0.033 ether; // Approx 1 MON / 30
    uint256 public constant TOURS_ON_REGISTER = 10 ether; // 10 $TOURS on registration

    uint256 public constant REWARD_UPDATE_MOOD = 1 ether;
    uint256 public constant REWARD_UPLOAD = 5 ether;
    uint256 public constant REWARD_STREAM_LISTENER = 1 ether;
    uint256 public constant REWARD_STREAM_ARTIST = 1 ether;
    uint256 public constant REWARD_RATE = 1 ether;

    event Registered(address indexed user, UserType userType);
    event MusicUploaded(uint256 indexed tokenId, address indexed artist, string title, string artistName, uint8[] moodCategories, string uri, string coverImage, uint256 price);
    event MoodUpdated(address indexed user, uint8[] moods);
    event MusicPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event SubscriptionRenewed(address indexed user, uint256 newEnd);
    event MusicStreamed(uint256 indexed tokenId, address indexed listener);
    event MusicRated(uint256 indexed tokenId, address indexed rater, uint8 emoji);

    error NotArtist();
    error NotListener();
    error AlreadyRegistered();
    error InvalidMoodCategory();
    error SubscriptionExpired();
    error InsufficientFee();
    error NotForSale();
    error InvalidEmoji();
    error TokenNotMinted();

    constructor(address _toursToken) ERC721("Vibraniom", "VIB") Ownable(msg.sender) {
        toursToken = IERC20(_toursToken);
    }

    // Modified: Use ownerOf instead of _exists
    function _requireMinted(uint256 tokenId) internal view {
        try this.ownerOf(tokenId) {
            // If ownerOf succeeds, token exists
        } catch {
            revert TokenNotMinted();
        }
    }

    function registerAsListener() external payable nonReentrant {
        if (msg.value != REGISTRATION_FEE) revert InsufficientFee();
        if (profiles[msg.sender].userType != UserType.None) revert AlreadyRegistered();

        profiles[msg.sender].userType = UserType.Listener;
        profiles[msg.sender].subscriptionEnd = block.timestamp + 1 days;
        toursToken.safeTransfer(msg.sender, TOURS_ON_REGISTER);

        emit Registered(msg.sender, UserType.Listener);
    }

    function registerAsArtist() external nonReentrant {
        if (profiles[msg.sender].userType != UserType.None) revert AlreadyRegistered();

        profiles[msg.sender].userType = UserType.Artist;
        profiles[msg.sender].subscriptionEnd = block.timestamp + 1 days;

        emit Registered(msg.sender, UserType.Artist);
    }

    function uploadMusic(
        string memory uri,
        string memory title,
        string memory artistName,
        string memory coverImage,
        uint8[] memory moodCategories,
        uint256 price
    ) external payable nonReentrant {
        if (profiles[msg.sender].userType != UserType.Artist) revert NotArtist();
        if (msg.value != UPLOAD_FEE) revert InsufficientFee();
        for (uint i = 0; i < moodCategories.length; i++) {
            if (moodCategories[i] > 10) revert InvalidMoodCategory();
        }

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        MusicNFT storage nft = musicNFTs[tokenId];
        nft.uri = uri;
        nft.title = title;
        nft.artistName = artistName;
        nft.coverImage = coverImage;
        nft.moodCategories = moodCategories;
        nft.artist = msg.sender;
        nft.price = price;

        toursToken.safeTransfer(msg.sender, REWARD_UPLOAD);

        emit MusicUploaded(tokenId, msg.sender, title, artistName, moodCategories, uri, coverImage, price);
    }

    function updateMoods(uint8[] memory moods) external nonReentrant {
        if (profiles[msg.sender].userType != UserType.Listener) revert NotListener();
        if (!_hasActiveSubscription(msg.sender)) revert SubscriptionExpired();
        for (uint i = 0; i < moods.length; i++) {
            if (moods[i] > 10) revert InvalidMoodCategory();
        }

        profiles[msg.sender].recentMoods = moods;

        toursToken.safeTransfer(msg.sender, REWARD_UPDATE_MOOD);

        emit MoodUpdated(msg.sender, moods);
    }

    function purchaseMusic(uint256 tokenId) external nonReentrant {
        if (!_hasActiveSubscription(msg.sender)) revert SubscriptionExpired();
        _requireMinted(tokenId);
        address currentOwner = ownerOf(tokenId);
        MusicNFT storage nft = musicNFTs[tokenId];
        if (nft.price == 0) revert NotForSale();

        toursToken.safeTransferFrom(msg.sender, nft.artist, nft.price);
        _safeTransfer(currentOwner, msg.sender, tokenId);

        nft.price = 0;

        emit MusicPurchased(tokenId, msg.sender, nft.price);
    }

    function renewSubscription() external payable nonReentrant {
        if (msg.value != DAILY_SUBSCRIPTION_FEE) revert InsufficientFee();

        UserProfile storage profile = profiles[msg.sender];
        if (profile.subscriptionEnd > block.timestamp) {
            profile.subscriptionEnd += 1 days;
        } else {
            profile.subscriptionEnd = block.timestamp + 1 days;
        }

        emit SubscriptionRenewed(msg.sender, profile.subscriptionEnd);
    }

    function streamMusic(uint256 tokenId) external nonReentrant {
        if (profiles[msg.sender].userType != UserType.Listener) revert NotListener();
        if (!_hasActiveSubscription(msg.sender)) revert SubscriptionExpired();
        _requireMinted(tokenId);

        MusicNFT storage nft = musicNFTs[tokenId];
        nft.streamCount++;

        toursToken.safeTransfer(msg.sender, REWARD_STREAM_LISTENER);
        toursToken.safeTransfer(nft.artist, REWARD_STREAM_ARTIST);

        emit MusicStreamed(tokenId, msg.sender);
    }

    function rateMusic(uint256 tokenId, uint8 emoji) external nonReentrant {
        if (profiles[msg.sender].userType != UserType.Listener) revert NotListener();
        if (!_hasActiveSubscription(msg.sender)) revert SubscriptionExpired();
        if (emoji > 4) revert InvalidEmoji();
        _requireMinted(tokenId);

        emojiRatings[tokenId][emoji]++;

        toursToken.safeTransfer(msg.sender, REWARD_RATE);

        emit MusicRated(tokenId, msg.sender, emoji);
    }

    function recommendMusic(address user) external view returns (uint256[] memory) {
        UserProfile memory profile = profiles[user];
        if (profile.userType != UserType.Listener || profile.recentMoods.length == 0) {
            return new uint256[](0);
        }

        uint256[] memory temp = new uint256[](_nextTokenId);
        uint256 count = 0;

        for (uint256 i = 0; i < _nextTokenId; i++) {
            bool matches = false;
            uint8[] memory nftMoods = musicNFTs[i].moodCategories;
            for (uint j = 0; j < profile.recentMoods.length; j++) {
                for (uint k = 0; k < nftMoods.length; k++) {
                    if (profile.recentMoods[j] == nftMoods[k]) {
                        matches = true;
                        break;
                    }
                }
                if (matches) break;
            }
            if (matches) {
                temp[count++] = i;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }
        return result;
    }

    function _hasActiveSubscription(address user) internal view returns (bool) {
        return profiles[user].subscriptionEnd > block.timestamp;
    }

    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function depositTours(uint256 amount) external onlyOwner {
        toursToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
