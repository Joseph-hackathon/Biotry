/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bio_dao.json`.
 */
export type BioDao = {
  "address": "2BY4tpMZVrHtzJHnYcQwuy3yL13QjeykvVjz2zCEjU6Y",
  "metadata": {
    "name": "bioDao",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createProfile",
      "docs": [
        "Register a new member and create their profile"
      ],
      "discriminator": [
        225,
        205,
        234,
        143,
        17,
        186,
        50,
        220
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  97,
                  111,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "bio",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeDao",
      "docs": [
        "Initialize the global DAO configuration"
      ],
      "discriminator": [
        128,
        226,
        96,
        90,
        39,
        56,
        24,
        196
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  97,
                  111,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "submitProposal",
      "docs": [
        "Submit a research proposal for funding or review"
      ],
      "discriminator": [
        224,
        38,
        210,
        52,
        167,
        150,
        221,
        150
      ],
      "accounts": [
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "config.proposal_count",
                "account": "daoConfig"
              }
            ]
          }
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  97,
                  111,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "contentUri",
          "type": "string"
        },
        {
          "name": "fundingGoal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "voteOnProposal",
      "docs": [
        "Vote on a research proposal"
      ],
      "discriminator": [
        188,
        239,
        13,
        88,
        119,
        199,
        251,
        119
      ],
      "accounts": [
        {
          "name": "proposal",
          "writable": true
        },
        {
          "name": "voteRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "proposal"
              },
              {
                "kind": "account",
                "path": "voter"
              }
            ]
          }
        },
        {
          "name": "memberProfile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "voter"
              }
            ]
          }
        },
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "approve",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "daoConfig",
      "discriminator": [
        55,
        209,
        87,
        224,
        30,
        202,
        192,
        246
      ]
    },
    {
      "name": "memberProfile",
      "discriminator": [
        30,
        196,
        27,
        233,
        146,
        140,
        108,
        254
      ]
    },
    {
      "name": "researchProposal",
      "discriminator": [
        53,
        25,
        72,
        1,
        171,
        37,
        107,
        232
      ]
    },
    {
      "name": "voteRecord",
      "discriminator": [
        112,
        9,
        123,
        165,
        234,
        9,
        157,
        167
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "usernameTooLong",
      "msg": "Username is too long"
    },
    {
      "code": 6001,
      "name": "bioTooLong",
      "msg": "Bio is too long"
    },
    {
      "code": 6002,
      "name": "titleTooLong",
      "msg": "Title is too long"
    },
    {
      "code": 6003,
      "name": "uriTooLong",
      "msg": "URI is too long"
    },
    {
      "code": 6004,
      "name": "proposalNotActive",
      "msg": "Proposal is not in active state"
    }
  ],
  "types": [
    {
      "name": "daoConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "memberCount",
            "type": "u64"
          },
          {
            "name": "proposalCount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "memberProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "bio",
            "type": "string"
          },
          {
            "name": "reputation",
            "type": "u64"
          },
          {
            "name": "joinedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "proposalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "funded"
          },
          {
            "name": "rejected"
          },
          {
            "name": "completed"
          }
        ]
      }
    },
    {
      "name": "researchProposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "contentUri",
            "type": "string"
          },
          {
            "name": "fundingGoal",
            "type": "u64"
          },
          {
            "name": "amountRaised",
            "type": "u64"
          },
          {
            "name": "votesFor",
            "type": "u64"
          },
          {
            "name": "votesAgainst",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "proposalStatus"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "voteRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "proposalId",
            "type": "u64"
          },
          {
            "name": "approve",
            "type": "bool"
          },
          {
            "name": "weight",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
