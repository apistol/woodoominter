// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VoodooVault is ERC1155Burnable, ReentrancyGuard, Ownable {
    using Strings for uint256;
    using ECDSA for bytes32;

    uint256 public supply;

    uint256 public constant MAX_TOKENS = 3;
    uint256 public constant tokenIdToMint = 0;

    uint256 public mintPrice = 0.09 ether;
    uint256 public constant MAX_SUPPLY = 20;

    string public constant NAME = "VOODOO VAULT";
    string public constant SYMBOL = "VV";
    string private baseURI;

    address public VOODOO_VAULT = 0xbff089ACEe42af06f6cA4E7e5A59c626bdF7A8c0;

    bool public saleLive = false;
    bool public locked = false;

    mapping(address => uint256) public salePurchasesOfWallet;

    constructor(
        string memory _baseURI
    ) ERC1155(_baseURI) {
        baseURI = _baseURI;
    }

    modifier notLocked {
        require(!locked, "Contract metadata is locked");
        _;
    }

    function setPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
    }

    function name() public pure returns (string memory) {
        return NAME;
    }

    function symbol() public pure returns (string memory) {
        return SYMBOL;
    }

    function uri(uint256 id) public view override returns (string memory) {
        require(bytes(baseURI).length > 0, "BASE URI NOT SET");
        require(id == 0, "URI: nonexistent token");
        return string(abi.encodePacked(baseURI, Strings.toString(id)));
    }

    function totalSupply() public view returns (uint256) {
        return supply;
    }

    function buy(uint256 tokenQuantity) external payable {
        require(saleLive, "SALE CLOSED");
        require(tokenQuantity > 0 && tokenQuantity <= MAX_TOKENS, "MINT AT LEAST 1 AND NOT MORE THAN 3 TOKENS");
        require(supply + tokenQuantity <= MAX_SUPPLY, "EXCEED MAX MINT");
        require(salePurchasesOfWallet[msg.sender] + tokenQuantity <= MAX_TOKENS, "EXCEED MINT PER ADDRESS");
        require(mintPrice * tokenQuantity == msg.value, "INCORRECT PAYMENT AMOUNT ");

        supply += tokenQuantity;
        salePurchasesOfWallet[msg.sender] += tokenQuantity;

        _mint(msg.sender, tokenIdToMint, tokenQuantity, "");
    }

    function setBaseUri(string memory _baseURI) external onlyOwner notLocked{
        baseURI = _baseURI;
    }

    function setVault(address _newVaultAddress) external onlyOwner notLocked {
        VOODOO_VAULT = _newVaultAddress;
    }

    function lockMetadata() external onlyOwner {
        locked = true;
    }

    function toggleSaleStatus() external onlyOwner {
        saleLive = !saleLive;
    }

    function withdraw() external onlyOwner {
        uint256 _balance = address(this).balance;
        require(address(VOODOO_VAULT) != address(0), "NO ADDRESS TO WITHDRAW");
        require(payable(VOODOO_VAULT).send(_balance), "WITHDRAW FAILED");
    }
}

